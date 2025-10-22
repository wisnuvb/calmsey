"use client";

import { H6, P } from "../ui/typography";

export function OngoingProjectsSection() {
  return (
    <section className="py-12 lg:py-16 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column - Co-Developed Programs */}
          <div className="space-y-3">
            <H6 style="h6bold" className="text-xl font-bold text-[#010107]">
              Co-Developed Programs
            </H6>
            <P style="p1reg" className="text-base lg:text-lg text-[#06072680]">
              Latin America, SouthEast Asia, and Sub-Saharan Africa.
            </P>
          </div>

          {/* Right Column - Ongoing Pilot Projects */}
          <div className="space-y-3">
            <H6 style="h6bold" className="text-xl font-bold text-[#010107]">
              Ongoing Pilot Projects
            </H6>
            <P style="p1reg" className="text-base lg:text-lg text-[#06072680]">
              Honduras, Senegal, Guinea-Bissau, Gambia, Bangladesh, Thailand,
              and Indonesia.
            </P>
          </div>
        </div>
      </div>
    </section>
  );
}
