"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageBuilder, { PageSection } from "@/components/admin/PageBuilder";

export default function NewPagePage() {
  const router = useRouter();
  const [pageData, setPageData] = useState({
    title: "",
    slug: "",
    template: "BASIC",
    status: "DRAFT",
    excerpt: "",
    seoTitle: "",
    seoDescription: "",
  });
  const [sections, setSections] = useState<PageSection[]>([]);
  const [saving, setSaving] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setPageData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleSave = async () => {
    if (!pageData.title.trim()) {
      alert("Please enter a page title");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: pageData.slug,
          template: pageData.template,
          status: pageData.status,
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
          sections: sections.map((section: PageSection) => ({
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
        const data = await response.json();
        router.push(`/admin/pages/${data.page.id}/edit`);
      } else {
        alert("Failed to create page");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to create page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Create New Page
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Build your page using the drag-and-drop page builder below.
        </p>
      </div>

      {/* Page Settings */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Page Settings</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title *
              </label>
              <input
                type="text"
                value={pageData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter page title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={pageData.slug}
                onChange={(e) =>
                  setPageData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="page-url-slug"
              />
              <p className="text-sm text-gray-500 mt-1">
                URL: /{pageData.slug}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template
              </label>
              <select
                value={pageData.template}
                onChange={(e) =>
                  setPageData((prev) => ({ ...prev, template: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BASIC">Basic</option>
                <option value="FULL_WIDTH">Full Width</option>
                <option value="LANDING">Landing Page</option>
                <option value="CONTACT">Contact Page</option>
                <option value="ABOUT">About Page</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={pageData.status}
                onChange={(e) =>
                  setPageData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Excerpt
            </label>
            <textarea
              value={pageData.excerpt}
              onChange={(e) =>
                setPageData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of this page"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={pageData.seoTitle}
                onChange={(e) =>
                  setPageData((prev) => ({ ...prev, seoTitle: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SEO optimized title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
              </label>
              <input
                type="text"
                value={pageData.seoDescription}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    seoDescription: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Meta description for search engines"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Page"}
            </button>
          </div>
        </div>
      </div>

      {/* Page Builder */}
      <PageBuilder initialSections={sections} onSave={setSections} />
    </div>
  );
}
