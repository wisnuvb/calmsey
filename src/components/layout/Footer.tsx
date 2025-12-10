"use client";

import Link from "next/link";
import Image from "next/image";
import { P } from "../ui/typography";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "About Us",
    links: [
      { label: "Vision", href: "/about-us" },
      { label: "Goal & Strategy", href: "/about-us" },
      { label: "Team", href: "/about-us" },
      { label: "Our Funders", href: "/about-us" },
      { label: "Our Guiding Policies", href: "/governance" },
    ],
  },
  {
    title: "Funds",
    links: [
      { label: "4 Supported Funds", href: "/our-fund" },
      { label: "Steering Committees", href: "/governance" },
      { label: "Partners", href: "/our-fund" },
    ],
  },
  {
    title: "Our Works",
    links: [
      { label: "How We Work", href: "/our-work" },
      { label: "Grantmaking Framework", href: "/our-fund" },
      { label: "Activities", href: "/our-work" },
      { label: "Stories", href: "/stories" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

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
                Turning Tides is fiscally sponsored by the Tenure Facility Fund,
                a US 501c3 subsidiary of the International Land & Forest Tenure
                Facility
              </p>
            </div>
          </div>

          {/* Navigation Links - 3 Columns */}
          <div className="lg:col-span-7 space-y-11">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-base font-semibold mb-4 text-[#C4DF99]">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link, i) => (
                      <li key={`${link.href}-${i}`}>
                        <Link
                          href={link.href}
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
            <div className="bg-[#150B28] p-6 flex items-center justify-between gap-20 rounded">
              <p className="text-white text-sm font-work-sans font-semibold leading-[150%] tracking-[0%]">
                Connect with us to co-create solutions that protect rights,
                sustain livelihoods, and centre local voices.
              </p>
              <Link
                href="/contact"
                className="py-4 px-6 border border-[#FFFFFF] rounded shrink-0 text-white text-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Connect with us Section - Right */}
          {/* <div className="lg:col-span-3">
            <P className="text-white text-sm leading-relaxed mb-6">
              Connect with us to co-create solutions that protect rights,
              sustain livelihoods, and centre local voices.
            </P>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-white text-sm font-medium rounded-md hover:bg-white hover:text-gray-900 transition-colors"
            >
              Contact Us
            </Link>
          </div> */}
        </div>

        {/* Horizontal Divider */}
      </div>
      <div className="py-8 bg-[#111416]">
        <p className="text-center text-base font-work-sans font-normal text-white/50">
          © Turning Tides. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
