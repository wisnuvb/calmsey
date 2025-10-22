"use client";

import { H3, P } from "../ui/typography";

export function AboutUsHeroSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Main Heading */}
          <div className="flex items-center">
            <H3 style="h3bold" className="text-[#3C62ED]">
              Flowing Funds Directly to Rights
              <br />
              Holders and Their Allies
            </H3>
          </div>

          {/* Right Column - Description Text */}
          <div className="space-y-8">
            <P style="p1reg" className="text-[#060726CC]">
              Turning Tides is an international, value-led, giving facility
              dedicated to supporting the tenure and rights of local
              communities, small-scale fishers, fish workers, and Indigenous
              Peoples.
            </P>

            <P style="p1reg" className="text-[#060726CC]">
              We are a bespoke institution designed specifically to address key
              imbalances in the funding landscape. We bring a sharp focus to
              tenure security and rights recognition for peoples connected to
              oceans, coasts, lakes, rivers and estuaries.
            </P>
          </div>
        </div>
      </div>
    </section>
  );
}
