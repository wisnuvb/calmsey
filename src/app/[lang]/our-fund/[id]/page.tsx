import React from "react";
import { notFound } from "next/navigation";
import { FundDetailHeader, FundDetailContent } from "@/components/main";
import { getFundDetailBySlug } from "@/lib/fund-details";
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

// SSR - render on every request, data always fresh from DB
export const dynamic = "force-dynamic";

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
