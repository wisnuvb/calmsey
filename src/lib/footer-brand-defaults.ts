/** Fallback when DB has no `FooterBrand` row yet (aligned with prisma seed + Footer.tsx originals). */
export const FOOTER_BRAND_FALLBACK = {
  id: "singleton" as const,
  mainLogoSrc: "/assets/Logo-white.png",
  mainLogoAlt: "Turning Tides Logo",
  mainLogoHref: "/",
  sponsorLogoSrc: "/assets/Logo-TenureFacility.png",
  sponsorLogoAlt: "Tenure Facility Logo",
  sponsorshipParagraph:
    "Turning Tides is a fiscally sponsored project of the Tenure Facility Fund, a US 501(c)3, which is a Not-for-profit subsidiary of the International Land and Forest Tenure Facility.",
};

export interface FooterBrandDTO {
  id: string;
  mainLogoSrc: string;
  mainLogoAlt: string;
  mainLogoHref: string;
  sponsorLogoSrc: string;
  sponsorLogoAlt: string;
  sponsorshipParagraph: string;
}

export function mergeFooterBrand(
  row?: Partial<FooterBrandDTO> | null,
): FooterBrandDTO {
  const r = row ?? {};
  return {
    ...FOOTER_BRAND_FALLBACK,
    ...r,
    id: "singleton",
    sponsorshipParagraph:
      typeof r.sponsorshipParagraph === "string" &&
      r.sponsorshipParagraph.trim() !== ""
        ? r.sponsorshipParagraph
        : FOOTER_BRAND_FALLBACK.sponsorshipParagraph,
  };
}
