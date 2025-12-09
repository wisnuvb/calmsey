export type IconType = "check" | "x" | "arrow" | "file-pdf";

export type CTAType = "button" | "pdf-download" | "link";

export type ContentType = "supported-unsupported" | "partners-will" | "custom";

export interface HeroImage {
  src: string;
  alt: string;
}

export interface FundHeader {
  smallHeading: string;
  title: string;
  subtitle: string | null;
  heroImage: HeroImage;
}

export interface SupportedItem {
  id: string;
  icon: IconType;
  title?: string;
  description: string;
}

export interface SupportedSection {
  title: string;
  items: SupportedItem[];
}

export interface UnsupportedItem {
  id: string;
  icon: IconType;
  description: string;
}

export interface UnsupportedSection {
  title: string;
  items: UnsupportedItem[];
}

export interface PartnersWillItem {
  id: string;
  icon: IconType;
  description: string;
}

export interface PartnersWillSection {
  title: string;
  items: PartnersWillItem[];
}

export interface CTA {
  type: CTAType;
  text: string;
  link?: string;
  file?: string;
  icon?: IconType;
  style: "primary" | "secondary" | "outline";
}

export interface SupportedUnsupportedContent {
  type: "supported-unsupported";
  intro: string[];
  supportedSection: SupportedSection;
  unsupportedSection: UnsupportedSection;
  cta: CTA;
}

export interface PartnersWillContent {
  type: "partners-will";
  intro: string[];
  partnersWillSection: PartnersWillSection;
  concluding: string[];
  cta: CTA;
}

export interface CustomSectionItem {
  id: string;
  icon?: IconType;
  title?: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title?: string;
  content?: string | string[];
  items?: CustomSectionItem[];
}

export interface CustomContent {
  type: "custom";
  sections: CustomSection[];
  cta?: CTA;
}

export type FundContent =
  | SupportedUnsupportedContent
  | PartnersWillContent
  | CustomContent;

export interface FundDetail {
  id: string;
  slug: string;
  header: FundHeader;
  content: FundContent;
}

export interface FundDetailsData {
  funds: FundDetail[];
}
