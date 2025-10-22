"use client";

import Link from "next/link";
import Image from "next/image";
import { H4, P } from "../ui/typography";

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
      { label: "Vision & Goals", href: "/about/vision" },
      { label: "Our Principles", href: "/about/principles" },
      { label: "Activities", href: "/about/activities" },
      { label: "Fiscal and Legal Status", href: "/about/legal" },
      { label: "Strategy to 2030", href: "/about/strategy" },
    ],
  },
  {
    title: "Our Works",
    links: [
      { label: "How We Work", href: "/work/how" },
      { label: "Where We Work", href: "/work/where" },
      { label: "Partner Stories", href: "/work/stories" },
      { label: "Grantmaking Framework", href: "/work/grantmaking" },
      { label: "Theory of Change", href: "/work/theory" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Supported Funds", href: "/get-involved/funds" },
      { label: "Funders", href: "/get-involved/funders" },
      { label: "Guiding Policies", href: "/get-involved/policies" },
      { label: "Steering Committees", href: "/get-involved/committees" },
      { label: "Partners", href: "/get-involved/partners" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Logo and Brand Section - Left */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <div className="w-16 h-16 relative mr-4">
                <Image
                  src="/assets/Logo-white.png"
                  alt="Turning Tides Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wider">
                TURNING TIDES
              </h1>
            </Link>

            <div className="mb-8">
              <P className="text-white text-sm leading-relaxed">
                Supporting rights, power, and let&apos;s turn the tide,
                together!
              </P>
            </div>

            {/* Hosting Information */}
            <div className="border-t border-white/20 pt-6 mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 relative mr-3">
                  <Image
                    src="/assets/Logo-white.png"
                    alt="Tenure Facility Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <P className="text-white text-sm">
                  Turning Tides is legally and fiscally hosted by the{" "}
                  <strong>Tenure Facility Fund</strong>
                </P>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-xs text-white/80">
              © {currentYear} Turning Tides. All Rights Reserved
            </div>
          </div>

          {/* Navigation Links - 3 Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-6 text-teal-300">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white hover:text-teal-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect with us Section - Right */}
          {/* <div className="lg:col-span-1">
            <div className="bg-indigo-900/50 rounded-lg p-6 border border-indigo-800/50">
              <P className="text-white text-sm leading-relaxed mb-6">
                Connect with us to co-create solutions that protect rights,
                sustain livelihoods, and centre local voices.
              </P>
              <Link
                href="/get-involved"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
              >
                Get Involved
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
