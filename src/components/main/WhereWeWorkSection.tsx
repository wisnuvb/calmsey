"use client";

import Image from "next/image";

export function WhereWeWorkSection() {
  return (
    <section
      className="pt-16 lg:pt-24"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #C8D3FF 0%, #FFFFFF 40%)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
            Where Does Turning Tides Work?
          </h2>
          <p className="text-base font-normal text-gray-600 max-w-[542px] mx-auto">
            We have active partnerships and and co-developed programs of work in{" "}
            <span className="text-[#7db5bb] font-medium">Latin America</span>,{" "}
            <span className="text-[#7db5bb] font-medium">SouthEast Asia</span>,
            and{" "}
            <span className="text-[#7db5bb] font-medium">
              Sub-Saharan Africa
            </span>
            .
          </p>
        </div>
      </div>
      <div className="relative w-full mx-auto">
        <Image
          src="/assets/demo/World map.png"
          alt="World Map"
          height={1000}
          width={1000}
          className="object-fill w-full h-full"
          priority
        />
      </div>
    </section>
  );
}
