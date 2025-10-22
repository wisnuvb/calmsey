"use client";

import { CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import { H2, P } from "@/components/ui/typography";

export function OurVisionSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#3C62ED] rounded-lg flex items-center justify-center ">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <H2 style="h2bold" className="text-[#010107]">
                  Our Vision
                </H2>
              </div>
            </div>

            {/* Vision Description */}
            <div className="space-y-6">
              <P style="p1reg" className="text-[#060726CC]">
                Local communities, small-scale fishers and fish workers, and
                Indigenous Peoples fully experience their tenure, and associated
                rights and agency in the allocation, use, conservation,
                management and development of coastal lands, shorelines, oceans,
                lakes, rivers, and associated resources – toward better
                environmental and societal outcomes.
              </P>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                Core Values
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-black border-2 border-black rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Our Principles
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/assets/demo/our-vision.png"
                alt="Group of women in collaborative meeting discussing community rights and environmental protection"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
