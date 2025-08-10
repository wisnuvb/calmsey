/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TranslationStatusCard from "@/components/admin/TranslationStatusCard";
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { worldLanguages } from "@/lib/world-languages.constants";

interface Article {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  updatedAt: string;
  author: {
    name: string;
    email: string;
  };
  translationStatus: {
    total: number;
    languages: string[];
    isComplete: boolean;
  };
  categories: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string }>;
}

export default function ArticlesAdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [availableLanguages, setAvailableLanguages] = useState(
    worldLanguages.length
  );

  useEffect(() => {
    fetchArticles();
    fetchLanguageCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchLanguageCount = async () => {
    try {
      const response = await fetch("/api/admin/languages");
      const data = await response.json();
      setAvailableLanguages(
        data.data?.filter((l: any) => l.isActive).length || 2
      );
    } catch (error) {
      console.error("Failed to fetch language count:", error);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await fetch(`/api/admin/articles?status=${filter}`);
      const data = await response.json();
      setArticles(data.data || []);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (articleId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this article? This will remove all translations."
      )
    )
      return;

    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setArticles(articles.filter((a) => a.id !== articleId));
      } else {
        alert("Failed to delete article");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete article");
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      PUBLISHED: "bg-green-100 text-green-800",
      DRAFT: "bg-yellow-100 text-yellow-800",
      ARCHIVED: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || colors.DRAFT;
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Articles</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage articles with multilingual support.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Article
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: "all", label: "All Articles" },
              { key: "published", label: "Published" },
              { key: "draft", label: "Drafts" },
              { key: "archived", label: "Archived" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Articles Table */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        {articles.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Translations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {article.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          /articles/{article.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                        article.status
                      )}`}
                    >
                      {article.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <GlobeAltIcon className="h-4 w-4 text-gray-400" />
                      <TranslationStatusCard
                        status={article.translationStatus}
                        availableLanguages={availableLanguages}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {article.translationStatus.languages.join(", ")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {article.categories.slice(0, 2).map((category) => (
                        <span
                          key={category.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {category.name}
                        </span>
                      ))}
                      {article.categories.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{article.categories.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.author.name || article.author.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {article.status === "PUBLISHED" && (
                        <a
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          className="text-gray-600 hover:text-gray-900"
                          title="View article"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </a>
                      )}
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit article"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete article"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first multilingual article.
            </p>
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Article
            </Link>
          </div>
        )}
      </div>

      {/* Translation Summary */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">
          Translation Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">
              {articles.length}
            </div>
            <div className="text-sm text-gray-600">Total Articles</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {
                articles.filter(
                  (a) => a.translationStatus.total === availableLanguages
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Fully Translated</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {
                articles.filter(
                  (a) =>
                    a.translationStatus.total > 1 &&
                    a.translationStatus.total < availableLanguages
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Partially Translated</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">
              {articles.filter((a) => a.translationStatus.total === 1).length}
            </div>
            <div className="text-sm text-gray-600">Single Language Only</div>
          </div>
        </div>
      </div>
    </div>
  );
}
