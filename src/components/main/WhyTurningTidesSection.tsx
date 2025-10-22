"use client";

import Image from "next/image";
import Link from "next/link";
import { H5, P } from "../ui/typography";

interface Funder {
  name: string;
  logo: string;
}

const funders: Funder[] = [
  { name: "Oceankind", logo: "/funders/oceankind.svg" },
  { name: "Ocean Resilience Climate Alliance", logo: "/funders/orca.svg" },
  { name: "David and Lucile Packard Foundation", logo: "/funders/packard.svg" },
  { name: "Waitt Institute", logo: "/funders/waitt.svg" },
  { name: "Oak Foundation", logo: "/funders/oak.svg" },
  { name: "Margaret A Cargill Philanthropies", logo: "/funders/cargill.svg" },
];

export function WhyTurningTidesSection() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          {/* Left Column - Mission Statement */}
          <div className="space-y-6">
            <H5
              style="h5regular"
              className="text-[#010107] tracking-tight text-2xl"
            >
              Turning Tides is an international, value-led, facility dedicated
              to supporting the tenure and rights of local communities, fisher
              peoples, and Indigenous Peoples.
            </H5>

            <P style="p1reg" className="text-[#060726CC] text-base">
              When tenure is secure and surrounding human rights are recognized,
              communities thrive, environments are protected, and economies are
              inclusive and strong.
            </P>

            {/* Funders Section */}
            <div className="pt-12 space-y-8">
              <P style="p1reg" className="text-[#060726CC] text-base">
                Together with the Funders Transforming Coastal Right
              </P>

              {/* Funders Logo Row */}
              <div className="flex flex-wrap lg:flex-nowrap items-center gap-8 lg:gap-12">
                {funders.map((funder, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100"
                    title={funder.name}
                  >
                    <div className="relative w-28 lg:w-36 h-10">
                      <Image
                        src={funder.logo}
                        alt={funder.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Why Box */}
          <div className="lg:pl-8">
            <H5 style="h5bold" className="text-[#3C62ED] mb-6">
              So Why Are We Turning Tides?
            </H5>

            <P style="p1reg" className="text-[#060726CC] text-base">
              Because collective rights are still being eroded by weak
              commitments, powerful interests, narrow views of tenure, and
              tokenistic efforts toward participation.
            </P>

            <div className="mt-8 sm:mt-14">
              <Link
                href="/about"
                className="inline-block px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors font-medium"
              >
                More About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
