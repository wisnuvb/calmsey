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

// Revalidate every 60 seconds (ISR) - ensures updates show even if revalidatePath misses
export const revalidate = 60;

// Enable dynamic rendering for routes not in generateStaticParams
export const dynamicParams = true;

// Generate static params for all fund slugs
export async function generateStaticParams() {
  try {
    // Get all fund slugs for default language (en)
    // In production, you might want to generate for all languages
    const slugs = await getAllFundSlugs("en");
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

  const fund = await getFundDetailBySlug(id, lang);

  if (!fund) {
    notFound();
  }

  return (
    <>
      <FundDetailHeader header={fund.header} />
      <FundDetailContent content={fund.content} />
    </>
  );
}
