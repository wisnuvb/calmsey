/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import TranslationTabs from "@/components/admin/TranslationTabs";

interface Translation {
  languageId: string;
  title: string;
  content: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
}

interface ArticleFormData {
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featuredImage: string;
  location: string;
  categories: string[];
  tags: string[];
}

interface ArticleFormProps {
  initialData?: {
    id?: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    featuredImage: string;
    location: string;
    categories: string[];
    tags: string[];
    content?: string;
    translations: Translation[];
  };
  onSave: (data: {
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    featuredImage: string;
    location: string;
    categories: string[];
    tags: string[];
    content: string;
    translations: Translation[];
  }) => Promise<void>;
  onDelete?: () => Promise<void>;
  isEdit?: boolean;
  loading?: boolean;
  saving?: boolean;
}

export default function ArticleForm({
  initialData,
  onSave,
  onDelete,
  isEdit = false,
  loading = false,
  saving = false,
}: ArticleFormProps) {
  const [articleData, setArticleData] = useState<ArticleFormData>({
    slug: initialData?.slug || "",
    status: initialData?.status || "DRAFT",
    featuredImage: initialData?.featuredImage || "",
    location: initialData?.location || "",
    categories: initialData?.categories || [],
    tags: initialData?.tags || [],
  });

  const [translations, setTranslations] = useState<Translation[]>(
    initialData?.translations || [
      {
        languageId: "en",
        title: "",
        content: "",
        excerpt: "",
        seoTitle: "",
        seoDescription: "",
      },
    ]
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      const formattedCategories = (data.data || []).map((cat: any) => ({
        id: cat.id,
        name:
          cat.translations?.find((t: any) => t.languageId === "en")?.name ||
          cat.name ||
          "Untitled",
        slug: cat.slug,
      }));
      setCategories(formattedCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/admin/tags");
      const data = await response.json();
      setTags(data.data || []);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  // Auto-generate slug from English title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Update slug when English title changes
  useEffect(() => {
    const englishTranslation = translations.find((t) => t.languageId === "en");
    if (englishTranslation?.title && !isEdit) {
      const newSlug = generateSlug(englishTranslation.title);
      setArticleData((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [translations, isEdit]);

  const updateTranslation = (
    languageId: string,
    data: Partial<Translation>
  ) => {
    setTranslations((prev) =>
      prev.map((t) => (t.languageId === languageId ? { ...t, ...data } : t))
    );
  };

  const addTranslation = (languageId: string) => {
    const newTranslation: Translation = {
      languageId,
      title: "",
      content: "",
      excerpt: "",
      seoTitle: "",
      seoDescription: "",
    };
    setTranslations((prev) => [...prev, newTranslation]);
  };

  const removeTranslation = (languageId: string) => {
    if (languageId === "en") {
      alert("Cannot remove the default language translation");
      return;
    }
    setTranslations((prev) => prev.filter((t) => t.languageId !== languageId));
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setArticleData((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categoryId]
        : prev.categories.filter((id) => id !== categoryId),
    }));
  };

  const handleTagChange = (tagId: string, checked: boolean) => {
    setArticleData((prev) => ({
      ...prev,
      tags: checked
        ? [...prev.tags, tagId]
        : prev.tags.filter((id) => id !== tagId),
    }));
  };

  const handleSave = async (publishNow = false) => {
    // Validation
    const englishTranslation = translations.find((t) => t.languageId === "en");
    if (!englishTranslation?.title.trim()) {
      alert("Please enter a title for the English version");
      return;
    }

    if (!englishTranslation?.content.trim()) {
      alert("Please enter content for the English version");
      return;
    }

    await onSave({
      slug: articleData.slug,
      status: publishNow ? "PUBLISHED" : articleData.status,
      featuredImage: articleData.featuredImage || "",
      location: articleData.location || "",
      categories: articleData.categories,
      tags: articleData.tags,
      translations: translations.filter((t) => t.title.trim()),
      content: englishTranslation.content, // Ambil content dari English translation
    });
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

  return (
    <div className="space-y-6">
      {/* Article Settings */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Article Settings
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Auto-generated Slug Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug {!isEdit && "(Auto-generated)"}
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={articleData.slug}
                  onChange={(e) =>
                    setArticleData((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="will-be-generated-from-title"
                />
                {!isEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      const englishTranslation = translations.find(
                        (t) => t.languageId === "en"
                      );
                      if (englishTranslation?.title) {
                        const newSlug = generateSlug(englishTranslation.title);
                        setArticleData((prev) => ({ ...prev, slug: newSlug }));
                      }
                    }}
                    className="ml-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Regenerate
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                URL: /articles/{articleData.slug || "your-article-title"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={articleData.status}
                onChange={(e) =>
                  setArticleData((prev) => ({
                    ...prev,
                    status: e.target.value as
                      | "DRAFT"
                      | "PUBLISHED"
                      | "ARCHIVED",
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image URL
            </label>
            <input
              type="url"
              value={articleData.featuredImage}
              onChange={(e) =>
                setArticleData((prev) => ({
                  ...prev,
                  featuredImage: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={articleData.location}
              onChange={(e) =>
                setArticleData((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Jakarta, Indonesia"
            />
            <p className="text-sm text-gray-500 mt-1">
              Optional: Add the location where this article is about or was
              written
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories - Checkbox Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Categories
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={articleData.categories.includes(category.id)}
                        onChange={(e) =>
                          handleCategoryChange(category.id, e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        {category.name}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No categories available. Create categories first.
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Selected: {articleData.categories.length} categories
              </p>
            </div>

            {/* Tags - Checkbox Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tags
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <label
                      key={tag.id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={articleData.tags.includes(tag.id)}
                        onChange={(e) =>
                          handleTagChange(tag.id, e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{tag.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No tags available. Create tags first.
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Selected: {articleData.tags.length} tags
              </p>
            </div>
          </div>

          {/* Selected Categories & Tags Preview */}
          {(articleData.categories.length > 0 ||
            articleData.tags.length > 0) && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Selected Items:
              </h4>
              <div className="flex flex-wrap gap-2">
                {/* Selected Categories */}
                {articleData.categories.map((categoryId) => {
                  const category = categories.find((c) => c.id === categoryId);
                  return (
                    <span
                      key={categoryId}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      📁 {category?.name}
                      <button
                        type="button"
                        onClick={() => handleCategoryChange(categoryId, false)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        x
                      </button>
                    </span>
                  );
                })}
                {/* Selected Tags */}
                {articleData.tags.map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId);
                  return (
                    <span
                      key={tagId}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      🏷️ {tag?.name}
                      <button
                        type="button"
                        onClick={() => handleTagChange(tagId, false)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        x
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Translation Management */}
      <TranslationTabs
        translations={translations}
        onUpdateTranslation={updateTranslation}
        onAddTranslation={addTranslation}
        onRemoveTranslation={removeTranslation}
        contentType="article"
      />

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pb-6">
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200"
          >
            Delete Article
          </button>
        )}
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Draft"}
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Publishing..." : "Publish Now"}
        </button>
      </div>
    </div>
  );
}
