import type { NextAuthOptions, User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { Adapter } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import { rateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";

// Extend the User type untuk mencakup role
interface ExtendedUser extends User {
  role: string;
}

// Login rate limiting (in-memory, lihat rate-limit.ts)
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILS_PER_EMAIL = 5;
const LOGIN_MAX_FAILS_PER_IP = 20;

// Re-validasi role dari DB paling sering tiap 5 menit
const ROLE_RECHECK_MS = 5 * 60 * 1000;

// Hash dummy (bcrypt cost 10) untuk menyamakan waktu respons saat user tidak ada
const DUMMY_HASH =
  "$2a$10$CwTycUXWue0Thq9StjUM0uJ8.qjDYb6xk0V5hVYh9C0o3m1m1Qm2e";

// rateLimit() menambah counter di setiap panggilan, jadi tidak ada cek
// "baca saja". Pendekatan: counter `failKey` hanya dinaikkan SETELAH gagal login;
// sebelum memeriksa kredensial kita memakai set `blockedUntil` terpisah yang
// diisi saat counter melewati batas.
const blockedUntil = new Map<string, number>();

function isBlocked(key: string): boolean {
  const until = blockedUntil.get(key);
  if (!until) return false;
  if (until <= Date.now()) {
    blockedUntil.delete(key);
    return false;
  }
  return true;
}

function recordFailure(key: string, limit: number) {
  // rateLimit() baru menolak saat count > limit, jadi pakai limit - 1 agar
  // percobaan gagal ke-`limit` langsung memicu blokir.
  const result = rateLimit(key, { limit: limit - 1, windowMs: LOGIN_WINDOW_MS });
  if (!result.ok) {
    blockedUntil.set(key, Date.now() + result.retryAfter * 1000);
  }
  // Pengaman memori
  if (blockedUntil.size > 10_000) {
    const now = Date.now();
    for (const [k, v] of blockedUntil) if (v <= now) blockedUntil.delete(k);
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    // Google OAuth (optional)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    // Credentials untuk admin login
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<ExtendedUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        if (
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        // MySQL (collation default case-insensitive): lookup lowercase aman
        const email = credentials.email.trim().toLowerCase();
        const emailKey = `login:fail:email:${email}`;
        const ipKey = `login:fail:ip:${getClientIp(
          (req?.headers ?? {}) as Record<string, string | string[] | undefined>
        )}`;

        if (isBlocked(emailKey) || isBlocked(ipKey)) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        // Selalu jalankan bcrypt.compare agar waktu respons tidak membocorkan
        // apakah email terdaftar.
        const passwordOk = await bcrypt.compare(
          credentials.password,
          user?.password || DUMMY_HASH
        );

        if (user && user.password && passwordOk) {
          resetRateLimit(emailKey);
          blockedUntil.delete(emailKey);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        }

        recordFailure(emailKey, LOGIN_MAX_FAILS_PER_EMAIL);
        recordFailure(ipKey, LOGIN_MAX_FAILS_PER_IP);
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 hari
  },
  callbacks: {
    async signIn({ user, account }) {
      // Google hanya boleh login untuk akun yang SUDAH ada di DB (tanpa auto-provision)
      if (account?.provider === "google") {
        const email = user?.email?.trim().toLowerCase();
        if (!email) return false;
        const existing = await prisma.user.findUnique({
          where: { email },
          select: { id: true },
        });
        return !!existing;
      }
      return true;
    },
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: ExtendedUser;
    }): Promise<JWT> {
      if (user) {
        token.role = user.role;
        token.roleCheckedAt = Date.now();
        delete token.invalid;
        return token;
      }

      // Re-validasi role dari DB tiap ~5 menit
      const now = Date.now();
      if (
        token.sub &&
        !token.invalid &&
        (!token.roleCheckedAt || now - token.roleCheckedAt > ROLE_RECHECK_MS)
      ) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true },
          });
          if (!dbUser) {
            token.invalid = true;
          } else {
            token.role = dbUser.role;
          }
          token.roleCheckedAt = now;
        } catch (error) {
          // DB error sementara: pertahankan token apa adanya, coba lagi nanti
          console.error("JWT role refresh failed:", error);
        }
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (token?.invalid) {
        // User sudah dihapus: kosongkan user agar requireAuth -> 401
        return { ...session, user: undefined } as unknown as Session;
      }
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
