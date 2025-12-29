"use client";

import React from "react";
import Link from "next/link";
import { H2, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export const ValueSupportSection: React.FC = () => {
  return (
    <section className="bg-[#3C62ED] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="max-w-2xl">
          <H2
            style="h2bold"
            className="text-white text-[32px] leading-[120%] tracking-normal mb-6"
          >
            We value your support
          </H2>
          <P
            style="p1reg"
            className="text-white text-xl leading-[140%] tracking-normal font-nunito-sans font-normal"
          >
            Connect with us to co-create solutions that protect rights, sustain
            livelihoods, and centre local voices.
          </P>
        </div>

        {/* Right Buttons */}
        <div className="flex flex-col gap-4 w-full md:w-auto min-w-[200px]">
          <Link href="/get-involved" passHref>
            <Button
              variant="secondary"
              className="w-full bg-white text-[#4870FF] hover:bg-white/90 font-semibold py-6"
            >
              Get Involved
            </Button>
          </Link>
          <Link href="/about-us" passHref>
            <Button
              variant="outline"
              className="w-full border-white text-white hover:bg-white/10 font-semibold py-6 bg-transparent"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
