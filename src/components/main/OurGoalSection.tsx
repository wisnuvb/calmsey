"use client";

import { Download, Target } from "lucide-react";
import Image from "next/image";
import { H2, H6, P } from "../ui/typography";

export function OurGoalSection() {
  return (
    <section className="py-8 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Our Goal Content */}
          <div className="space-y-8">
            {/* Icon and Heading */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#6BB7BC] rounded-[12px] flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <H2 style="h2bold" className="text-[#010107]">
                  Our Goal
                </H2>
              </div>
            </div>

            {/* Goal Description */}
            <div className="space-y-6">
              <P style="p1reg" className="text-[#060726CC]">
                Implement and champion new approaches to funding that center
                power with, and provide resources directly to, local
                communities, small scale fishers and fish workers, and
                Indigenous Peoples, and the groups that legitimately serve them.
              </P>

              <P style="p1reg" className="text-[#060726CC]">
                With more appropriate and equitable resourcing, actors across
                scales - can build rights recognition and conditions that ensure
                tenure security.
              </P>
            </div>
          </div>

          {/* Right Column - Strategy Card */}
          <div className="space-y-8 relative">
            {/* Strategy Description */}
            <div className="p-6 mt-0 sm:-mt-36 border border-[#CADBEA] bg-white w-full sm:w-[456px] rounded">
              <Image
                src="/assets/demo/strategy.png"
                alt="Strategy to 2030"
                className="object-contain w-full h-[313px] mb-6"
                width={500}
                height={313}
                priority
              />
              <H6 style="h6bold" className="text-[#3C62ED] mb-3 ">
                The Strategy to 2030
              </H6>

              <P style="p1reg" className="text-[#06072680] mb-3 leading-[150%]">
                See our multi-scale & geographic approach, how we identify the
                challenges, create risk mitigation, milestones and estimate
                budget until 2030 ahead.
              </P>

              <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-base text-[#010107] font-normal border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
