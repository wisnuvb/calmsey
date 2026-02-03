import React from "react";
import { notFound } from "next/navigation";
import { FundDetailHeader, FundDetailContent } from "@/components/main";
import { getFundDetailBySlug, getAllFundSlugs } from "@/lib/fund-details";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const fund = await getFundDetailBySlug(id, lang);

  if (!fund) {
    return {
      title: "Fund Not Found",
    };
  }

  return {
    title: fund.header.title,
    description: fund.header.subtitle || `Detail for ${fund.header.title}`,
    alternates: {
      canonical: `/${lang}/our-fund/${id}`,
      languages: {
        en: `/en/our-fund/${id}`,
        id: `/id/our-fund/${id}`,
      },
    },
  };
}

// Enable dynamic rendering for routes not in generateStaticParams
export const dynamicParams = true;

// Generate static params for all fund slugs
export async function generateStaticParams() {
  try {
    // Get all fund slugs for default language (en)
    // In production, you might want to generate for all languages
    const slugs = await getAllFundSlugs("en");
    console.log("Generated static params for funds:", slugs);
    return slugs.map((slug) => ({
      id: slug,
    }));
  } catch (error) {
    console.error("Error generating static params for funds:", error);
    // Return empty array to allow dynamic rendering
    return [];
  }
}

export default async function DetailOurFundPage({ params }: PageProps) {
  const { lang, id } = await params;

  console.log(`Fetching fund detail for slug: ${id}, language: ${lang}`);

  const fund = await getFundDetailBySlug(id, lang);

  if (!fund) {
    console.warn(`Fund not found: slug=${id}, lang=${lang}`);
    notFound();
  }

  console.log(`Fund found: ${fund.id} - ${fund.header.title}`);

  return (
    <>
      <FundDetailHeader header={fund.header} />
      <FundDetailContent content={fund.content} />
    </>
  );
}
