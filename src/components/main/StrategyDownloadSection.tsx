"use client";

import { Download } from "lucide-react";
import { H5 } from "../ui/typography";

export function StrategyDownloadSection() {
  return (
    <section className="py-8 lg:py-11 bg-gradient-to-r from-[#3C62ED] to-[#2f55e1]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left - Text Content */}
          <H5
            style="h5regular"
            className="text-white leading-relaxed max-w-[466px]"
          >
            Our approach, risk mitigation, milestones and estimate budget until
            2030 ahead.
          </H5>

          {/* Right - CTA Button */}
          <div className="flex flex-col items-center justify-center shrink-0 font-normal text-base gap-3">
            <a
              href="/downloads/strategy-2030.pdf"
              download
              className="inline-flex items-center gap-3 px-8 py-5 bg-white text-gray-900 rounded hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl w-full sm:w-[310px]"
            >
              <Download className="w-5 h-5" />
              Download Our Strategy 2030
            </a>
            <button className="py-5 px-8 border border-white rounded w-full sm:w-[310px] text-white">
              Learn Our Funds
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
