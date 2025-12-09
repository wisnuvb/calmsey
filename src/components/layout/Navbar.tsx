"use client";

import Link from "next/link";
import { useState, useEffect, useContext } from "react";
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

interface BackgroundContextType {
  backgroundType: "light" | "dark";
  setBackgroundType: (type: "light" | "dark") => void;
}

const BackgroundContext = React.createContext<
  BackgroundContextType | undefined
>(undefined);

export const useBackgroundContext = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error(
      "useBackgroundContext must be used within BackgroundProvider"
    );
  }
  return context;
};

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
  const [backgroundType, setBackgroundType] = useState<"light" | "dark">(
    "light"
  );
  const [currentBackgroundAnalysis, setCurrentBackgroundAnalysis] = useState<{
    isLight: boolean;
    luminance: number;
  } | null>(null);

  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
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

      if (visibleSection) {
        const analysis = analyzeElementBackground(visibleSection);
        if (analysis) {
          setCurrentBackgroundAnalysis({
            isLight: analysis.isLight,
            luminance: analysis.luminance,
          });
          setBackgroundType(analysis.isLight ? "light" : "dark");
        }
      }
    };

    const handleScroll = () => {
      detectBackground();
    };

    // Reset state when navigating
    setCurrentBackgroundAnalysis(null);
    setBackgroundType("light");

    // Detect initial with delay to ensure DOM has been rendered
    const timeoutId = setTimeout(() => {
      detectBackground();
    }, 100);

    // Detect when scrolling
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Remove dependency array or add pathname if needed

  // Replace useEffect for route change with pathname
  useEffect(() => {
    // Reset and detect again when route changes
    setCurrentBackgroundAnalysis(null);
    setBackgroundType("light");

    const timeoutId = setTimeout(() => {
      const detectBackground = () => {
        const sections = document.querySelectorAll("[data-section]");

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

        if (visibleSection) {
          const analysis = analyzeElementBackground(visibleSection);
          if (analysis) {
            setCurrentBackgroundAnalysis({
              isLight: analysis.isLight,
              luminance: analysis.luminance,
            });
            setBackgroundType(analysis.isLight ? "light" : "dark");
          }
        }
      };

      detectBackground();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [pathname]); // Use pathname from Next.js router

  const getLogoSrc = () => {
    if (isScrolled) {
      return "/assets/Logo-white.png";
    } else {
      if (currentBackgroundAnalysis) {
        return currentBackgroundAnalysis.isLight
          ? "/assets/Logo-blue.png"
          : "/assets/Logo-white.png";
      } else {
        return backgroundType === "light"
          ? "/assets/Logo-white.png"
          : "/assets/Logo-white.png";
      }
    }
  };
  console.log(
    getLogoSrc(),
    currentBackgroundAnalysis,
    backgroundType,
    isScrolled
  );
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
                  "transition-colors duration-300 text-base font-normal hover:text-blue-300",
                  isScrolled || !currentBackgroundAnalysis?.isLight
                    ? "text-white"
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
              isDark={isScrolled || !currentBackgroundAnalysis?.isLight}
            />

            {/* Get Involved Button */}
            <Link
              href="/get-involved"
              className={cn(
                "px-6 py-2 border-2 rounded transition-all duration-300 text-sm font-medium",
                isScrolled || !currentBackgroundAnalysis?.isLight
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
              "lg:hidden p-2 rounded-md transition-colors duration-300 hover:bg-gray-100",
              isScrolled || !currentBackgroundAnalysis?.isLight
                ? "text-white hover:text-blue-300 hover:bg-blue-500/20"
                : "text-gray-700 hover:text-[#3C62ED]"
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
            isScrolled || !currentBackgroundAnalysis?.isLight
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
                  isScrolled || !currentBackgroundAnalysis?.isLight
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
                  isScrolled || !currentBackgroundAnalysis?.isLight
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
                  isScrolled || !currentBackgroundAnalysis?.isLight
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
