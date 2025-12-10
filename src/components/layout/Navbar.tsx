"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "../public/LanguageProvider";
import { LanguageSwitcher } from "../public/LanguageSwitcher";
import { usePathname } from "next/navigation";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "About Us", href: "/about-us" },
  { label: "Our Work", href: "/our-work" },
  { label: "Our Fund", href: "/our-fund" },
  { label: "Governance", href: "/governance" },
  { label: "Partner Stories", href: "/stories" },
  // { label: "Articles", href: "/articles" },
];

const analyzeBackgroundColor = (element: Element) => {
  const computedStyle = window.getComputedStyle(element);
  const backgroundColor = computedStyle.backgroundColor;

  const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);

    // Hitung luminositas menggunakan formula WCAG
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return {
      rgb: { r, g, b },
      luminance,
      isLight: luminance > 0.5,
      backgroundColor,
    };
  }

  return null;
};

// Fungsi untuk menganalisis semua CSS classes dan mencari background color
const analyzeElementBackground = (element: Element) => {
  // Ambil CSS custom properties
  const rootStyles = getComputedStyle(document.documentElement);
  const cssVars: Record<string, string> = {};
  for (let i = 0; i < rootStyles.length; i++) {
    const prop = rootStyles[i];
    if (prop.startsWith("--")) {
      cssVars[prop as keyof typeof cssVars] = rootStyles.getPropertyValue(prop);
    }
  }
  return analyzeBackgroundColor(element);
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentBackgroundAnalysis, setCurrentBackgroundAnalysis] = useState<{
    isLight: boolean;
    luminance: number;
  } | null>(null);

  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const { language } = useLanguage();

  // Check if current page is home
  const isHomePage =
    pathname === `/${language}` ||
    pathname === "/en" ||
    pathname === "/id" ||
    pathname === "/";

  // Check if current page is get-involved (should also have dynamic background detection)
  const isGetInvolvedPage =
    pathname === `/${language}/get-involved` ||
    pathname === "/en/get-involved" ||
    pathname === "/id/get-involved";

  // Pages that should have dynamic background detection
  const hasDynamicBackground = isHomePage || isGetInvolvedPage;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Jalankan deteksi background di home page dan get-involved page
    // Untuk halaman lain, gunakan white text/logo
    if (!hasDynamicBackground) {
      setCurrentBackgroundAnalysis({
        isLight: false,
        luminance: 0,
      });
      return;
    }

    const detectBackground = () => {
      // Find all elements with data-section
      const sections = document.querySelectorAll("[data-section]");

      // Find section that is currently visible in the viewport
      let visibleSection = null;
      let maxVisibleArea = 0;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const visibleHeight =
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

        if (visibleHeight > 0 && visibleHeight > maxVisibleArea) {
          maxVisibleArea = visibleHeight;
          visibleSection = section;
        }
      });

      // Fallback: jika tidak ada section yang terlihat, gunakan section pertama
      let elementToAnalyze: Element | null = visibleSection;
      if (!elementToAnalyze && sections.length > 0) {
        elementToAnalyze = sections[0] as Element;
      }

      if (elementToAnalyze) {
        const analysis = analyzeElementBackground(elementToAnalyze);
        if (analysis) {
          setCurrentBackgroundAnalysis({
            isLight: analysis.isLight,
            luminance: analysis.luminance,
          });
          return true;
        }
      }
      return false;
    };

    const handleScroll = () => {
      detectBackground();
    };

    // Fungsi untuk deteksi dengan multiple attempts
    const attemptDetection = (maxAttempts = 8, delay = 150) => {
      let attempts = 0;

      const tryDetect = () => {
        attempts++;
        const success = detectBackground();

        if (!success && attempts < maxAttempts) {
          setTimeout(() => {
            requestAnimationFrame(tryDetect);
          }, delay);
        }
      };

      // Delay awal untuk memastikan DOM ready
      setTimeout(() => {
        requestAnimationFrame(tryDetect);
      }, 100);
    };

    // Reset state
    setCurrentBackgroundAnalysis(null);

    // Deteksi awal dengan multiple attempts
    attemptDetection(8, 150);

    // Deteksi saat scrolling
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, hasDynamicBackground]);

  const getLogoSrc = () => {
    // Untuk halaman tanpa dynamic background, selalu gunakan logo putih
    if (!hasDynamicBackground) {
      return "/assets/Logo-white.png";
    }

    // Untuk halaman dengan dynamic background (home & get-involved)
    if (isScrolled) {
      return "/assets/Logo-white.png";
    } else {
      if (currentBackgroundAnalysis) {
        return currentBackgroundAnalysis.isLight
          ? "/assets/Logo-blue.png"
          : "/assets/Logo-white.png";
      } else {
        return "/assets/Logo-blue.png";
      }
    }
  };
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-[#3C62ED]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-[79px] h-[50px] relative">
              <Image
                src={getLogoSrc()}
                alt="Turning Tides Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${language}${link.href}`}
                className={cn(
                  "transition-colors duration-300 text-base font-normal",
                  !hasDynamicBackground ||
                    isScrolled ||
                    !currentBackgroundAnalysis?.isLight
                    ? "text-white hover:text-blue-300"
                    : "text-gray-700 hover:text-[#3C62ED]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Selector */}
            {/* <button
              className={`flex items-center space-x-1 text-base font-normal transition-colors duration-300 hover:text-blue-300 ${
                isScrolled || !currentBackgroundAnalysis?.isLight
                  ? "text-white"
                  : "text-gray-700 hover:text-[#3C62ED]"
              }`}
            >
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-4 h-4" />
            </button> */}
            <LanguageSwitcher
              currentLanguage={language}
              isDark={
                !hasDynamicBackground ||
                isScrolled ||
                !currentBackgroundAnalysis?.isLight
              }
            />

            {/* Get Involved Button */}
            <Link
              href="/get-involved"
              className={cn(
                "px-6 py-2 border-2 rounded transition-all duration-300 text-sm font-medium",
                !hasDynamicBackground ||
                  isScrolled ||
                  !currentBackgroundAnalysis?.isLight
                  ? "border-white text-white hover:bg-white hover:text-[#3C62ED]"
                  : "border-[#3C62ED] text-[#3C62ED] hover:bg-[#3C62ED] hover:text-white"
              )}
            >
              Get Involved
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={cn(
              "lg:hidden p-2 rounded-md transition-colors duration-300",
              !hasDynamicBackground ||
                isScrolled ||
                !currentBackgroundAnalysis?.isLight
                ? "text-white hover:text-blue-300 hover:bg-blue-500/20"
                : "text-gray-700 hover:text-[#3C62ED] hover:bg-gray-100"
            )}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={cn(
            "lg:hidden border-t transition-all duration-300",
            !hasDynamicBackground ||
              isScrolled ||
              !currentBackgroundAnalysis?.isLight
              ? "bg-[#3C62ED]/95 backdrop-blur-md border-blue-500/30"
              : "bg-white border-gray-200"
          )}
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300",
                  !hasDynamicBackground ||
                    isScrolled ||
                    !currentBackgroundAnalysis?.isLight
                    ? "text-white hover:text-blue-300 hover:bg-blue-500/20"
                    : "text-gray-700 hover:text-[#3C62ED] hover:bg-gray-50"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <button
                className={cn(
                  "w-full flex items-center justify-center space-x-1 px-3 py-2 text-sm transition-colors duration-300",
                  !hasDynamicBackground ||
                    isScrolled ||
                    !currentBackgroundAnalysis?.isLight
                    ? "text-white hover:text-blue-300"
                    : "text-gray-700 hover:text-[#3C62ED]"
                )}
              >
                <span>{language}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <Link
                href="/get-involved"
                className={cn(
                  "block w-full text-center px-6 py-2 border-2 rounded transition-all duration-300 text-sm font-medium",
                  !hasDynamicBackground ||
                    isScrolled ||
                    !currentBackgroundAnalysis?.isLight
                    ? "border-white text-white hover:bg-white hover:text-[#3C62ED]"
                    : "border-[#3C62ED] text-[#3C62ED] hover:bg-[#3C62ED] hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
