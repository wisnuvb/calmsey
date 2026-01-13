/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ArticleForm from "@/components/admin/ArticleForm";

interface Translation {
  languageId: string;
  title: string;
  content: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface ArticleData {
  id: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featuredImage: string;
  location: string;
  categories: string[];
  tags: string[];
  translations: Translation[];
  content: string;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/articles/${articleId}`);
      if (response.ok) {
        const result = await response.json();

        // Transform translations: sisipkan content dari article ke English translation
        const transformedTranslations = (result.article.translations || []).map(
          (t: any) => {
            // Untuk English translation, tambahkan content dari article
            if (t.languageId === "en") {
              return {
                ...t,
                content: result.article.content || "",
              };
            }
            // Untuk translation lain, content kosong (karena menggunakan browser translation)
            return {
              ...t,
              content: "",
            };
          }
        );

        // Jika tidak ada English translation, buat satu dengan content dari article
        const englishTranslation = transformedTranslations.find(
          (t: any) => t.languageId === "en"
        );
        if (!englishTranslation) {
          transformedTranslations.push({
            languageId: "en",
            title: result.article.title || "",
            content: result.article.content || "",
            excerpt: result.article.excerpt || "",
            seoTitle: "",
            seoDescription: "",
          });
        }

        // Transform the data to match our form structure
        const transformedData: ArticleData = {
          id: result.article.id,
          slug: result.article.slug,
          status: result.article.status,
          featuredImage: result.article.featuredImage || "",
          location: result.article.location || "",
          categories: result.article.categories?.map((c: any) => c.id) || [],
          tags: result.article.articleTag?.map((t: any) => t.tagId) || [],
          translations: transformedTranslations,
          content: result.article.content || "",
        };

        setArticleData(transformedData);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch article");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch article");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: {
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    featuredImage: string;
    categories: string[];
    tags: string[];
    translations: Translation[];
    content: string;
  }) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Refresh the article data
        await fetchArticle();
        alert("Article updated successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update article");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to update article");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this article? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/articles");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete article");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete article");
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/admin/articles"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  if (!articleData) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Article not found
          </h2>
          <Link
            href="/admin/articles"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <Link
                href="/admin/articles"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Articles
              </Link>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mt-2">
              Edit Article:{" "}
              {articleData.translations.find((t) => t.languageId === "en")
                ?.title || "Untitled"}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Update your article content and settings below.
            </p>
          </div>
        </div>
      </div>

      <ArticleForm
        initialData={articleData}
        onSave={handleSave}
        onDelete={handleDelete}
        isEdit={true}
        loading={loading}
        saving={saving}
      />
    </div>
  );
}
