import {
  CoastalTenureSupportSection,
  FourFundsSection,
  GuidingPoliciesSection,
  HeroSection,
  OurPartnersSection,
  PotentialPartnersSection,
} from "@/components/main";
import React from "react";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "id"
        ? "Mitra Kami - Turning Tides Facility"
        : "Our Partners - Turning Tides Facility",
    description:
      lang === "id"
        ? "Mitra Turning Tides Facility"
        : "Partners of Turning Tides Facility",
    alternates: {
      canonical: `/${lang}/get-involved/partners`,
      languages: {
        en: "/en/get-involved/partners",
        id: "/id/get-involved/partners",
      },
    },
  };
}

const PartnersPage = async ({ params }: PageProps) => {
  await params;
  return (
    <>
      <HeroSection
        variant="simple"
        title="Together Transforming Coastal Right"
        subtitle="Turning Tides’s conservation efforts – from protecting oceans and endangered species to supporting small-scale fishers, biodiversity conservation, and sustainable communities."
      />
      <PotentialPartnersSection />
      <FourFundsSection />
      <OurPartnersSection />
      <GuidingPoliciesSection />
      <CoastalTenureSupportSection />
    </>
  );
};

export default PartnersPage;
