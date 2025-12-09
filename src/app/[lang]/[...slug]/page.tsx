import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    lang: string;
    slug: string[];
  }>;
}

export default async function DetailPage({ params }: PageProps) {
  await params;
  notFound();
}
