"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

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
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);
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
      }
    } catch (error) {
      console.error("Error fetching footer:", error);
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
              label: "4 Supported Funds",
              href: "/our-fund",
              target: "SELF",
            },
            {
              id: "7",
              label: "Steering Committees",
              href: "/governance",
              target: "SELF",
            },
            { id: "8", label: "Partners", href: "/our-fund", target: "SELF" },
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center">Loading...</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-br from-[#1E0F39] via-[#2a1551] to-[#3a1d6f] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-32">
          {/* Logo and Brand Section - Left */}
          <div className="lg:col-span-4">
            <Link href="/">
              <div className="w-auto h-32 relative mr-3">
                <Image
                  src="/assets/Logo-white.png"
                  alt="Turning Tides Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <div className="border-t border-white/50 my-8" />
            <div className="flex items-start gap-6">
              <Image
                src="/assets/Logo-TenureFacility.png"
                alt="Tenure Facility Logo"
                width={100}
                height={100}
                className="w-auto h-11 object-contain"
              />
              <p className="font-work-sans font-normal text-base text-white/80 leading-[150%] tracking-[0%]">
                Turning Tides is legally and fiscally hosted by{" "}
                <strong>the Tenure Facility Fund</strong>
              </p>
            </div>
          </div>

          {/* Navigation Links - 3 Columns */}
          <div className="lg:col-span-7 space-y-11">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {footerSections.map((section) => (
                <div key={section.id}>
                  <h3 className="text-base font-semibold mb-4 text-[#C4DF99]">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.id}>
                        <Link
                          href={link.href}
                          target={link.target === "BLANK" ? "_blank" : "_self"}
                          rel={
                            link.target === "BLANK"
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="text-sm text-white hover:text-[#C4DF99] transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
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
