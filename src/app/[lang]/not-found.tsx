import {
  ErrorPageIntro,
  PublicErrorShell,
  errorPrimaryButtonClass,
} from "@/components/main/PublicErrorShell";
import { PublicAPI } from "@/lib/public-api";
import Link from "next/link";

export default async function NotFound() {
  const recentArticles = await PublicAPI.getRecentArticles("en", 3);

  return (
    <PublicErrorShell>
      <ErrorPageIntro
        code="404"
        title="Page not found"
        description={`Sorry, we couldn't find the page you're looking for.`}
      />

      <div className="mt-8">
        <Link href="/en" className={errorPrimaryButtonClass}>
          Go to homepage
        </Link>
      </div>

      {recentArticles.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Recent Articles
          </h3>
          <div className="space-y-3">
            {recentArticles.map((article) => (
              <Link
                key={article.id}
                href={`/en/articles/${article.slug}`}
                className="block rounded-lg bg-white p-3 shadow transition-shadow hover:shadow-md"
              >
                <h4 className="font-medium text-gray-900">{article.title}</h4>
                {article.excerpt && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {article.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </PublicErrorShell>
  );
}
