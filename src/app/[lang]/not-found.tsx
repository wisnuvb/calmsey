import { PublicAPI } from "@/lib/public-api";
import Link from "next/link";

export default async function NotFound() {
  const recentArticles = await PublicAPI.getRecentArticles("en", 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Page not found
          </h2>
          <p className="mt-4 text-base text-gray-500">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go back home
          </Link>
        </div>

        {recentArticles.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Articles
            </h3>
            <div className="space-y-3">
              {recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="block p-3 rounded-lg bg-white shadow hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium text-gray-900">{article.title}</h4>
                  {article.excerpt && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
