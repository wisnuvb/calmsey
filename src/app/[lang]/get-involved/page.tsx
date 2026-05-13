import { GetInvolvedSection } from "@/components/main";
import { PageContentProvider } from "@/contexts/PageContentContext";
import { getPageContentServer } from "@/lib/page-content-server";
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
        ? "Terlibat - Turning Tides Facility"
        : "Get Involved - Turning Tides Facility",
    description:
      lang === "id"
        ? "Terlibat dengan Turning Tides Facility"
        : "Get Involved with Turning Tides Facility",
    alternates: {
      canonical: `/${lang}/get-involved`,
      languages: {
        en: "/en/get-involved",
        id: "/id/get-involved",
      },
    },
  };
}

const GetInvolvedPage = async ({ params }: PageProps) => {
  const { lang } = await params;
  const language = lang || "en";
  const content = await getPageContentServer("GET_INVOLVED", language);

  return (
    <PageContentProvider
      content={content}
      pageType="GET_INVOLVED"
      language={language}
    >
      <GetInvolvedSection />
    </PageContentProvider>
  );
};

export default GetInvolvedPage;
