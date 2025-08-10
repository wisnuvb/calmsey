// src/components/admin/SharedAdminLogin.tsx
"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface LoginTexts {
  title: string;
  subtitle: string;
  emailLabel: string;
  passwordLabel: string;
  signInButton: string;
  signingIn: string;
  errorInvalid: string;
  errorGeneral: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  secureAccess: string;
  systemStatus: string;
  copyright: string;
}

const LOGIN_TEXTS: Record<string, LoginTexts> = {
  en: {
    title: "Admin Portal",
    subtitle: "Turning Tides Facility",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    signInButton: "Sign in to Portal",
    signingIn: "Signing in...",
    errorInvalid: "Invalid credentials. Please check your email and password.",
    errorGeneral: "Something went wrong. Please try again.",
    emailPlaceholder: "admin@turningtidesfacility.org",
    passwordPlaceholder: "Enter your password",
    secureAccess: "Secure access to content management",
    systemStatus: "System Status: Online",
    copyright: "© 2025 Turning Tides Facility",
  },
  id: {
    title: "Portal Admin",
    subtitle: "Fasilitas Turning Tides",
    emailLabel: "Alamat Email",
    passwordLabel: "Kata Sandi",
    signInButton: "Masuk ke Portal",
    signingIn: "Sedang masuk...",
    errorInvalid: "Kredensial tidak valid. Periksa email dan kata sandi Anda.",
    errorGeneral: "Terjadi kesalahan. Silakan coba lagi.",
    emailPlaceholder: "admin@turningtidesfacility.org",
    passwordPlaceholder: "Masukkan kata sandi",
    secureAccess: "Akses aman ke manajemen konten",
    systemStatus: "Status Sistem: Online",
    copyright: "© 2025 Fasilitas Turning Tides",
  },
};

interface SharedAdminLoginProps {
  language?: string;
}

export default function SharedAdminLogin({
  language = "en",
}: SharedAdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const texts = LOGIN_TEXTS[language] || LOGIN_TEXTS.en;

  useEffect(() => {
    getSession().then((session) => {
      if (session?.user) {
        router.push("/admin");
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(texts.errorInvalid);
      } else {
        router.push("/admin");
      }
    } catch {
      setError(texts.errorGeneral);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-300/30 to-teal-300/30 rounded-full blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transform -rotate-3">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-teal-700 bg-clip-text text-transparent">
                {texts.title}
              </h1>
              <p className="text-gray-600 text-sm font-medium">
                {texts.subtitle}
              </p>
              <p className="text-gray-500 text-xs">Content Management System</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                {texts.emailLabel}
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                  placeholder={texts.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                {texts.passwordLabel}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 pr-12"
                  placeholder={texts.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{texts.signingIn}</span>
                </div>
              ) : (
                texts.signInButton
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-gray-200/50">
            <p className="text-xs text-gray-500">{texts.secureAccess}</p>
            <p className="text-xs text-gray-400 mt-1">{texts.copyright}</p>
          </div>
        </div>

        <div className="mt-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{texts.systemStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
