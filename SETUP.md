# Setup Documentation

## Package yang Telah Diinstal

### 1. Tailwind CSS v3
- **File konfigurasi**: `tailwind.config.js`
- **CSS**: Direktif Tailwind telah ditambahkan ke `src/app/globals.css`
- **Fitur**: Utility-first CSS framework untuk styling

### 2. NextAuth v4
- **File konfigurasi**: `src/lib/auth.ts`
- **API Route**: `src/app/api/auth/[...nextauth]/route.ts`
- **Database**: Menggunakan Prisma adapter
- **Fitur**: Authentication dan authorization

### 3. Prisma v5
- **Schema**: `prisma/schema.prisma`
- **Client**: `src/lib/prisma.ts`
- **Model**: User, Account, Session, VerificationToken untuk NextAuth
- **Fitur**: ORM untuk database

### 4. SWC
- **Konfigurasi**: `next.config.ts`
- **Fitur**: Fast JavaScript/TypeScript compiler

### 5. Lodash
- **Utility**: `src/lib/lodash-utils.ts`
- **Fitur**: Utility functions untuk JavaScript

### 6. Date-fns
- **Utility**: `src/lib/date-utils.ts`
- **Locale**: Indonesia (id)
- **Fitur**: Date manipulation dan formatting

## Setup yang Diperlukan

### 1. Environment Variables
Buat file `.env` dengan variabel berikut:

```env
# Database - MySQL
DATABASE_URL="mysql://username:password@localhost:3306/turningtidesfacility"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"

# OAuth Providers (uncomment dan isi sesuai kebutuhan)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# GITHUB_ID=""
# GITHUB_SECRET=""
```

### 2. Database Setup
1. Setup database MySQL
2. Update `DATABASE_URL` di file `.env` dengan kredensial MySQL Anda
3. Jalankan migrasi:
   ```bash
   npx prisma db push
   ```

### 3. NextAuth Setup
1. Tambahkan provider yang diinginkan di `src/lib/auth.ts`
2. Setup OAuth credentials di provider (Google, GitHub, dll.)
3. Update environment variables

## Scripts yang Tersedia

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm run start

# Lint
npm run lint

# Prisma commands
npx prisma generate
npx prisma db push
npx prisma studio
```

## Struktur File

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── date-utils.ts
│   └── lodash-utils.ts
└── ...

prisma/
└── schema.prisma

tailwind.config.js
next.config.ts
```

## Catatan Penting

1. **Security**: Jangan commit file `.env` ke repository
2. **Database**: Pastikan database PostgreSQL sudah running
3. **NextAuth**: Setup provider sesuai kebutuhan aplikasi
4. **Tailwind**: Gunakan class utility untuk styling
5. **TypeScript**: Semua file sudah menggunakan TypeScript 