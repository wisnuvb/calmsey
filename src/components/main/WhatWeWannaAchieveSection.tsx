"use client";

import Image from "next/image";
import { H3, P } from "@/components/ui/typography";

export function WhatWeWannaAchieveSection() {
  return (
    <section className="py-16 lg:py-[100px] bg-[#F1FAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Small Heading */}

        <P
          style="p2reg"
          className="text-[#548F93] uppercase mb-3 text-sm leading-[150%] font-normal"
        >
          WHAT WE WANNA ACHIEVE
        </P>

        {/* Main Quote */}
        <H3
          style="h3reg"
          className="text-[#010107] font-normal max-w-4xl mx-auto mb-[70px]"
        >
          &quot;A World Where Local Communities, Fishers and Indigenous Peoples
          Can Lead in Manage, Conserve, Develop, and Adaptation of Their
          Environments and Resources.&quot;
        </H3>

        {/* Full Width Image */}
        <div className="relative w-full h-64 sm:h-80 lg:h-96 xl:h-[380px] rounded-sm overflow-hidden ">
          <Image
            src="/assets/demo/achive.png"
            alt="Bustling floating market with boats carrying goods, showcasing local communities managing their resources"
            width={1000}
            height={400}
            className="w-full object-cover -mt-40"
            priority
          />
        </div>
      </div>
    </section>
  );
}
