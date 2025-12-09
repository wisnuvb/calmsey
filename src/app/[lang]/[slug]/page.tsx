import { SimpleCMS } from "@/lib/services/simple-cms";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    lang: string;
    slug: string | string[];
  }>;
}

export default async function DynamicPage({ params }: PageProps) {
  const { lang, slug } = await params;

  // Ensure slug is an array
  const slugArray = Array.isArray(slug) ? slug : [slug];
  const slugString = slugArray.join("/");

  const page = await SimpleCMS.getPageBySlug(slugString, lang);

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
              src={getImageUrl(page.featuredImage)}
              alt={page.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold mb-6">{page.title}</h1>

        {page.excerpt && (
          <p className="text-xl text-gray-600 mb-8">{page.excerpt}</p>
        )}

        {/* Render dynamic content */}
        {Object.keys(page.pageContent).length > 0 ? (
          <div className="prose prose-lg max-w-none">
            {Object.entries(page.pageContent).map(([key, content]) => {
              if (content.type === "HTML" || content.type === "RICH_TEXT") {
                return (
                  <div
                    key={key}
                    dangerouslySetInnerHTML={{ __html: String(content.value) }}
                  />
                );
              }
              return (
                <div key={key}>
                  <strong>{key}:</strong> {String(content.value)}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            <p>No content available for this page.</p>
          </div>
        )}
      </div>
    </div>
  );
}
