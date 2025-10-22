import {
  CoastalTenureSupportSection,
  FourFundsSection,
  GuidingPoliciesSection,
  HeroSection,
  OurPartnersSection,
  PotentialPartnersSection,
} from "@/components/main";
import React from "react";

const PartnersPage = () => {
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
