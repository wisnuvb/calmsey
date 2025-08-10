import { PublicAPI, SupportedLanguage } from "@/lib/public-api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CategoryPage } from "@/components/public/CategoryPage";

interface DynamicPageProps {
  params: Promise<{ lang: SupportedLanguage; slug: string[] }>;
}

export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const resolution = await PublicAPI.resolveRoute(slug, lang);

  if (resolution.type === "category") {
    const { category } = resolution.data;
    return {
      title: category.name,
      description: category.description || `Articles in ${category.name}`,
      alternates: {
        canonical: `/${lang}/${slug.join("/")}`,
      },
    };
  }

  return {
    title: "Page Not Found",
  };
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { lang, slug } = await params;
  const resolution = await PublicAPI.resolveRoute(slug, lang);

  if (resolution.type === "notfound") {
    notFound();
  }

  if (resolution.type === "category") {
    return <CategoryPage data={resolution.data} language={lang} slug={slug} />;
  }

  notFound();
}
