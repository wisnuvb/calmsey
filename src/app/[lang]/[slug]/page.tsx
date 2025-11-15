import { SimpleCMS } from "@/lib/services/simple-cms";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await SimpleCMS.getPageBySlug(params.slug, "en"); // Default to English

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {page.featuredImage && (
          <div className="mb-8">
            <Image
              width={1000}
              height={1000}
              src={page.featuredImage}
              alt={page.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold mb-6">{page.title}</h1>

        {page.excerpt && (
          <p className="text-xl text-gray-600 mb-8">{page.excerpt}</p>
        )}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.pageContent.content.value }}
        />
      </div>
    </div>
  );
}
