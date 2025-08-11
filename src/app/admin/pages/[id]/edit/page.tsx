/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import PageBuilder, { PageSection } from "@/components/admin/PageBuilder";
import { PageBuilderWithBrandkit } from "@/components/page-builder/PageBuilderWithBrandkit";

interface PageData {
  id: string;
  title: string;
  slug: string;
  template: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  featuredImage?: string;
}

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  const [pageData, setPageData] = useState<PageData>({
    id: "",
    title: "",
    slug: "",
    template: "BASIC",
    status: "DRAFT",
    excerpt: "",
    seoTitle: "",
    seoDescription: "",
  });
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/pages/${pageId}`);
      if (response.ok) {
        const result = await response.json();
        const page = result.data;

        // Set page data
        setPageData({
          id: page.id,
          title: page.translations?.[0]?.title || "",
          slug: page.slug,
          template: page.template,
          status: page.status,
          excerpt: page.translations?.[0]?.excerpt || "",
          seoTitle: page.translations?.[0]?.seoTitle || "",
          seoDescription: page.translations?.[0]?.seoDescription || "",
          featuredImage: page.featuredImage,
        });

        // Set sections if they exist
        if (page.sections && page.sections.length > 0) {
          const formattedSections = page.sections.map((section: any) => ({
            id: section.id,
            type: section.type,
            content: {
              title: section.translations?.[0]?.title || "",
              content: section.translations?.[0]?.content || "",
              ...JSON.parse(section.settings || "{}"),
            },
            order: section.order,
          }));
          setSections(formattedSections);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to load page");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to load page");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedSections: PageSection[]) => {
    if (!pageData.title.trim()) {
      alert("Please enter a page title");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: pageData.slug,
          template: pageData.template,
          status: pageData.status,
          featuredImage: pageData.featuredImage,
          translations: [
            {
              title: pageData.title,
              content: "", // Will be built from sections
              excerpt: pageData.excerpt,
              seoTitle: pageData.seoTitle,
              seoDescription: pageData.seoDescription,
              languageId: "en",
            },
          ],
          sections: updatedSections.map((section: PageSection) => ({
            type: section.type,
            settings: section.content,
            translations: [
              {
                title: section.content.title,
                content: section.content.content || "",
                languageId: "en",
              },
            ],
          })),
        }),
      });

      if (response.ok) {
        alert("Page updated successfully!");
        router.push("/admin/pages");
      } else {
        const errorData = await response.json();
        alert(`Failed to update page: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to update page");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this page? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Page deleted successfully!");
        router.push("/admin/pages");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete page: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete page");
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Error Loading Page
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/admin/pages"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Pages
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
                href="/admin/pages"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Pages
              </Link>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mt-2">
              Edit Page: {pageData.title}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Update your page content and settings below.
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Page
            </button>
            <button
              onClick={() => handleSave(sections)}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Page Builder */}
      {/* <PageBuilder
        pageId={pageId}
        initialSections={sections}
        onSave={handleSave}
      /> */}
      <PageBuilderWithBrandkit
        pageId={pageId}
        onSectionSelect={() => {}}
        onSectionsChange={() => {}}
        sections={[]}
      />
    </div>
  );
}
