"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type MouseEvent } from "react";
import {
  mergeFooterBrand,
  type FooterBrandDTO,
} from "@/lib/footer-brand-defaults";
import { getImageUrl } from "@/lib/utils";
import { useLanguage } from "../public/LanguageProvider";
import { useRouter } from "next/navigation";
import { clientNavigateWithGoogleTranslateSafety } from "@/lib/safe-client-navigation";

/**
 * Resolves internal footer link href to include current language prefix and preserve hash.
 * Internal: relative path (starts with /, not //) and target !== BLANK.
 * External: target BLANK or full URL -> return as-is.
 */
function resolveFooterLinkHref(
  href: string,
  language: string,
  target: "SELF" | "BLANK"
): string {
  if (
    target === "BLANK" ||
    href.startsWith("http://") ||
    href.startsWith("https://")
  ) {
    return href;
  }
  if (!href.startsWith("/") || href.startsWith("//")) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const pathname = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";

  const langPrefixMatch = pathname.match(/^\/[a-z]{2,3}(\/|$)/);
  const resolvedPath = langPrefixMatch
    ? `/${language}${pathname.slice(3)}`
    : pathname === "/"
      ? `/${language}`
      : `/${language}${pathname}`;

  return resolvedPath + hash;
}

function handleFooterInternalNav(
  e: MouseEvent<HTMLAnchorElement>,
  language: string,
  href: string,
  target: "SELF" | "BLANK",
  router: { push: (h: string) => void },
) {
  if (target === "BLANK") return;
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    !href.startsWith("/")
  ) {
    return;
  }
  if (language === "en") return;

  e.preventDefault();
  void clientNavigateWithGoogleTranslateSafety(router, href);
}

interface FooterLink {
  id: string;
  label: string;
  href: string;
  target: "SELF" | "BLANK";
}

interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

export function Footer() {
  const router = useRouter();
  const { language } = useLanguage();
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);
  const [brand, setBrand] = useState<FooterBrandDTO>(() =>
    mergeFooterBrand(null),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      const response = await fetch("/api/public/footer");
      if (response.ok) {
        const data = await response.json();
        setFooterSections(data.sections || []);
        setBrand(mergeFooterBrand(data.brand ?? undefined));
      }
    } catch (error) {
      console.error("Error fetching footer:", error);
      setBrand(mergeFooterBrand(null));
      // Fallback to default sections if API fails
      setFooterSections([
        {
          id: "1",
          title: "About Us",
          links: [
            { id: "1", label: "Vision", href: "/about-us", target: "SELF" },
            {
              id: "2",
              label: "Goal & Strategy",
              href: "/about-us",
              target: "SELF",
            },
            { id: "3", label: "Team", href: "/about-us", target: "SELF" },
            {
              id: "4",
              label: "Our Funders",
              href: "/about-us",
              target: "SELF",
            },
            {
              id: "5",
              label: "Our Guiding Policies",
              href: "/governance",
              target: "SELF",
            },
          ],
        },
        {
          id: "2",
          title: "Funds",
          links: [
            {
              id: "6",
              label: "Our Funds",
              href: "/our-fund",
              target: "SELF",
            },
            {
              id: "7",
              label: "Steering Committees",
              href: "/governance",
              target: "SELF",
            },
            { id: "8", label: "Partners", href: "/get-involved/partners", target: "SELF" },
          ],
        },
        {
          id: "3",
          title: "Our Works",
          links: [
            {
              id: "9",
              label: "How We Work",
              href: "/our-work",
              target: "SELF",
            },
            {
              id: "10",
              label: "Our Approach",
              href: "/our-approach",
              target: "SELF",
            },
            {
              id: "11",
              label: "Activities",
              href: "/our-work",
              target: "SELF",
            },
            { id: "12", label: "Stories", href: "/stories", target: "SELF" },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <footer className="bg-gradient-to-br from-[#1E0F39] via-[#2a1551] to-[#3a1d6f] text-white">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="text-center">Loading...</div>
        </div>
      </footer>
    );
  }

  const logoHref = resolveFooterLinkHref(
    brand.mainLogoHref,
    language,
    "SELF",
  );

  return (
    <footer className="bg-gradient-to-br from-[#1E0F39] via-[#2a1551] to-[#3a1d6f] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Logo and Brand Section - Left */}
          <div>
            <Link
              href={logoHref}
              onClick={(e) =>
                handleFooterInternalNav(e, language, logoHref, "SELF", router)
              }
              className="inline-block w-full"
            >
              <div className="relative h-32 w-full max-w-[220px] sm:max-w-[240px]">
                <Image
                  src={getImageUrl(brand.mainLogoSrc)}
                  alt={brand.mainLogoAlt}
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <div className="border-t border-white/50 my-8" />
            <div className="flex items-start gap-6">
              <Image
                src={getImageUrl(brand.sponsorLogoSrc)}
                alt={brand.sponsorLogoAlt}
                width={100}
                height={100}
                className="w-auto h-11 object-contain"
              />
              <p className="font-work-sans font-normal text-base text-white/80 leading-[27px] tracking-[0%] whitespace-pre-line">
                {brand.sponsorshipParagraph}
              </p>
            </div>
          </div>

          {/* Navigation Links - 3 Columns */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {footerSections.map((section) => (
                <div key={section.id}>
                  <h3 className="text-base font-semibold mb-4 text-[#C4DF99]">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => {
                      const linkHref = resolveFooterLinkHref(
                        link.href,
                        language,
                        link.target,
                      );
                      return (
                      <li key={link.id}>
                        <Link
                          href={linkHref}
                          target={link.target === "BLANK" ? "_blank" : "_self"}
                          rel={
                            link.target === "BLANK"
                              ? "noopener noreferrer"
                              : undefined
                          }
                          onClick={(e) =>
                            handleFooterInternalNav(
                              e,
                              language,
                              linkHref,
                              link.target,
                              router,
                            )
                          }
                          className="text-sm text-white hover:text-[#C4DF99] transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="py-8 bg-[#111416]">
        <p className="text-center text-base font-work-sans font-normal text-white/50">
          © Turning Tides. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
