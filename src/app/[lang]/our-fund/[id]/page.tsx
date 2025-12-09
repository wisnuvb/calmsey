import React from "react";
import { notFound } from "next/navigation";
import { FundDetailHeader, FundDetailContent } from "@/components/main";
import { getFundDetailBySlug } from "@/lib/fund-details";

interface PageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export default async function DetailOurFundPage({ params }: PageProps) {
  const { id } = await params;
  const fund = getFundDetailBySlug(id);

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
