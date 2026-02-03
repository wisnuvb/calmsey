/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import TranslationTabs from "@/components/admin/TranslationTabs";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { Image as ImageIcon } from "lucide-react";
import { useToast } from "../ui/toast";

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

interface RelatedArticle {
  id: string;
  title: string;
  url: string;
}

interface ArticleFormData {
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featuredImage: string;
  location: string;
  categories: string[];
  tags: string[];
  videoUrl: string;
  posterImage: string;
  partnerOrganization: {
    name: string;
    logo: string;
    fullName: string;
  } | null;
  photos: Array<{ id: string; src: string; alt: string }>;
  relatedArticles: RelatedArticle[];
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
    videoUrl?: string | null;
    posterImage?: string | null;
    partnerOrganization?: {
      name: string;
      logo: string;
      fullName: string;
    } | null;
    photos?: Array<{ id: string; src: string; alt: string }> | null;
    relatedArticles?: RelatedArticle[] | null;
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
    videoUrl?: string | null;
    posterImage?: string | null;
    partnerOrganization?: {
      name: string;
      logo: string;
      fullName: string;
    } | null;
    photos?: Array<{ id: string; src: string; alt: string }> | null;
    relatedArticles?: RelatedArticle[] | null;
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
  const { addToast } = useToast();

  // Helper function to safely parse JSON arrays
  const safeParseArray = (value: any): any[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const [articleData, setArticleData] = useState<ArticleFormData>({
    slug: initialData?.slug || "",
    status: initialData?.status || "DRAFT",
    featuredImage: initialData?.featuredImage || "",
    location: initialData?.location || "",
    categories: initialData?.categories || [],
    tags: initialData?.tags || [],
    videoUrl: initialData?.videoUrl || "",
    posterImage: initialData?.posterImage || "",
    partnerOrganization: initialData?.partnerOrganization || null,
    photos: safeParseArray(initialData?.photos),
    relatedArticles: safeParseArray(initialData?.relatedArticles),
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
    ],
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [availableArticles, setAvailableArticles] = useState<
    Array<{ id: string; slug: string; title: string }>
  >([]);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number | null>(
    null,
  );
  const [isAddingMultiplePhotos, setIsAddingMultiplePhotos] = useState(false);
  const [isSelectingPartnerLogo, setIsSelectingPartnerLogo] = useState(false);
  const [relatedArticlesSearch, setRelatedArticlesSearch] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchAvailableArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAvailableArticles = async () => {
    try {
      const response = await fetch(
        "/api/admin/articles?limit=100&status=PUBLISHED",
      );
      const data = await response.json();
      const articles = (data.data || [])
        .map((article: any) => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
        }))
        .filter((article: any) => article.id !== initialData?.id); // Exclude current article
      setAvailableArticles(articles);
    } catch (error) {
      console.error("Failed to fetch available articles:", error);
    }
  };

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
    data: Partial<Translation>,
  ) => {
    setTranslations((prev) =>
      prev.map((t) => (t.languageId === languageId ? { ...t, ...data } : t)),
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
      addToast({
        type: "warning",
        title: "Cannot Remove",
        description: "The default language translation cannot be removed",
      });
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
      addToast({
        type: "error",
        title: "Validation Error",
        description: "Please enter a title for the English version",
      });
      return;
    }

    if (!englishTranslation?.content.trim()) {
      addToast({
        type: "error",
        title: "Validation Error",
        description: "Please enter content for the English version",
      });
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
      videoUrl: articleData.videoUrl || null,
      posterImage: articleData.posterImage || null,
      partnerOrganization: articleData.partnerOrganization,
      photos: articleData.photos.length > 0 ? articleData.photos : null,
      relatedArticles:
        articleData.relatedArticles.length > 0
          ? articleData.relatedArticles
          : null,
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
          <h2 className="text-lg font-medium text-gray-900">
            Article Settings
          </h2>
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
                        (t) => t.languageId === "en",
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

          {/* Story/Partner Story Fields */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Story/Partner Story Fields (Optional)
            </h3>
            <div className="space-y-6">
              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <input
                  type="url"
                  value={articleData.videoUrl}
                  onChange={(e) =>
                    setArticleData((prev) => ({
                      ...prev,
                      videoUrl: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/video.mp4"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Optional: Video URL for story detail page
                </p>
              </div>

              {/* Poster Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Poster Image URL
                </label>
                <input
                  type="url"
                  value={articleData.posterImage}
                  onChange={(e) =>
                    setArticleData((prev) => ({
                      ...prev,
                      posterImage: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/poster.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Optional: Thumbnail/poster image for video
                </p>
              </div>

              {/* Partner Organization */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Partner Organization
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={articleData.partnerOrganization?.name || ""}
                      onChange={(e) =>
                        setArticleData((prev) => ({
                          ...prev,
                          partnerOrganization: {
                            name: e.target.value,
                            logo: prev.partnerOrganization?.logo || "",
                            fullName: prev.partnerOrganization?.fullName || "",
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Yayasan Konservasi Laut"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Organization Logo URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={articleData.partnerOrganization?.logo || ""}
                        onChange={(e) =>
                          setArticleData((prev) => ({
                            ...prev,
                            partnerOrganization: {
                              name: prev.partnerOrganization?.name || "",
                              logo: e.target.value,
                              fullName:
                                prev.partnerOrganization?.fullName || "",
                            },
                          }))
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/logo.png"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsSelectingPartnerLogo(true);
                          setMediaPickerOpen(true);
                        }}
                        className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1 whitespace-nowrap"
                      >
                        <ImageIcon className="w-3 h-3" />
                        Browse
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Full Organization Name
                    </label>
                    <input
                      type="text"
                      value={articleData.partnerOrganization?.fullName || ""}
                      onChange={(e) =>
                        setArticleData((prev) => ({
                          ...prev,
                          partnerOrganization: {
                            name: prev.partnerOrganization?.name || "",
                            logo: prev.partnerOrganization?.logo || "",
                            fullName: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="YKL YAYASAN KONSERVASI LAUT INDONESIA"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setArticleData((prev) => ({
                        ...prev,
                        partnerOrganization: null,
                      }))
                    }
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Clear Partner Organization
                  </button>
                </div>
              </div>

              {/* Photos */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Photos
                </label>
                <div className="space-y-3">
                  {articleData.photos.map((photo, index) => (
                    <div
                      key={photo.id || index}
                      className="flex gap-2 items-start border border-gray-200 rounded p-3"
                    >
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={photo.id}
                          onChange={(e) => {
                            const newPhotos = [...articleData.photos];
                            newPhotos[index] = {
                              ...photo,
                              id: e.target.value,
                            };
                            setArticleData((prev) => ({
                              ...prev,
                              photos: newPhotos,
                            }));
                          }}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="Photo ID"
                        />
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={photo.src}
                            onChange={(e) => {
                              const newPhotos = [...articleData.photos];
                              newPhotos[index] = {
                                ...photo,
                                src: e.target.value,
                              };
                              setArticleData((prev) => ({
                                ...prev,
                                photos: newPhotos,
                              }));
                            }}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="Photo URL"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentPhotoIndex(index);
                              setMediaPickerOpen(true);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1 whitespace-nowrap"
                          >
                            <ImageIcon className="w-3 h-3" />
                            Browse
                          </button>
                        </div>
                        <input
                          type="text"
                          value={photo.alt}
                          onChange={(e) => {
                            const newPhotos = [...articleData.photos];
                            newPhotos[index] = {
                              ...photo,
                              alt: e.target.value,
                            };
                            setArticleData((prev) => ({
                              ...prev,
                              photos: newPhotos,
                            }));
                          }}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="Alt text"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newPhotos = articleData.photos.filter(
                            (_, i) => i !== index,
                          );
                          setArticleData((prev) => ({
                            ...prev,
                            photos: newPhotos,
                          }));
                        }}
                        className="text-red-600 hover:text-red-800 text-xs px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setArticleData((prev) => ({
                          ...prev,
                          photos: [
                            ...prev.photos,
                            { id: `photo-${Date.now()}`, src: "", alt: "" },
                          ],
                        }));
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      + Add Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPhotoIndex(null);
                        setIsAddingMultiplePhotos(true);
                        setMediaPickerOpen(true);
                      }}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Browse from Media
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Optional: Add photos for story detail page
                </p>
              </div>
            </div>

            {/* Related Articles */}
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Related Links About This Story
              </label>
              <div className="space-y-3">
                {/* Article Picker */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Search and Select Articles
                  </label>
                  <input
                    type="text"
                    value={relatedArticlesSearch}
                    onChange={(e) => setRelatedArticlesSearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search articles by title..."
                  />
                  {relatedArticlesSearch && (
                    <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white">
                      {availableArticles
                        .filter((article) =>
                          article.title
                            .toLowerCase()
                            .includes(relatedArticlesSearch.toLowerCase()),
                        )
                        .map((article) => (
                          <button
                            key={article.id}
                            type="button"
                            onClick={() => {
                              const isAlreadyAdded =
                                articleData.relatedArticles.some(
                                  (ra) => ra.id === article.id,
                                );
                              if (!isAlreadyAdded) {
                                setArticleData((prev) => ({
                                  ...prev,
                                  relatedArticles: [
                                    ...prev.relatedArticles,
                                    {
                                      id: article.id,
                                      title: article.title,
                                      url: `/stories/${article.slug}`,
                                    },
                                  ],
                                }));
                                setRelatedArticlesSearch("");
                              }
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-200 last:border-b-0"
                          >
                            <div className="text-sm text-gray-900">
                              {article.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {article.slug}
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* Selected Related Articles */}
                {articleData.relatedArticles.length > 0 && (
                  <div className="border-t pt-3">
                    <label className="block text-xs text-gray-600 mb-2 font-medium">
                      Selected Articles ({articleData.relatedArticles.length})
                    </label>
                    <div className="space-y-2">
                      {articleData.relatedArticles.map((article, index) => (
                        <div
                          key={article.id || index}
                          className="flex gap-2 items-start border border-gray-200 rounded p-3 bg-gray-50"
                        >
                          <div className="flex-1 space-y-1">
                            <div className="text-sm font-medium text-gray-900">
                              {article.title}
                            </div>
                            <input
                              type="text"
                              value={article.url}
                              onChange={(e) => {
                                const newRelated = [
                                  ...articleData.relatedArticles,
                                ];
                                newRelated[index] = {
                                  ...article,
                                  url: e.target.value,
                                };
                                setArticleData((prev) => ({
                                  ...prev,
                                  relatedArticles: newRelated,
                                }));
                              }}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                              placeholder="https://example.com/story"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newRelated =
                                articleData.relatedArticles.filter(
                                  (_, i) => i !== index,
                                );
                              setArticleData((prev) => ({
                                ...prev,
                                relatedArticles: newRelated,
                              }));
                            }}
                            className="text-red-600 hover:text-red-800 text-xs px-2 py-1 whitespace-nowrap"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Optional: Search and select published articles to display as
                related links. URL will auto-populate, but can be customized.
              </p>
            </div>
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
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Selected Items:
              </h3>
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

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setCurrentPhotoIndex(null);
          setIsAddingMultiplePhotos(false);
          setIsSelectingPartnerLogo(false);
        }}
        onSelect={(selectedUrls) => {
          if (isSelectingPartnerLogo && selectedUrls.length > 0) {
            // Update partner organization logo
            setArticleData((prev) => ({
              ...prev,
              partnerOrganization: {
                name: prev.partnerOrganization?.name || "",
                logo: selectedUrls[0],
                fullName: prev.partnerOrganization?.fullName || "",
              },
            }));
            setIsSelectingPartnerLogo(false);
          } else if (isAddingMultiplePhotos && selectedUrls.length > 0) {
            // Add multiple photos from media library
            const newPhotos = selectedUrls.map((url, idx) => ({
              id: `photo-${Date.now()}-${idx}`,
              src: url,
              alt: "",
            }));
            setArticleData((prev) => ({
              ...prev,
              photos: [...prev.photos, ...newPhotos],
            }));
            setIsAddingMultiplePhotos(false);
          } else if (currentPhotoIndex !== null && selectedUrls.length > 0) {
            // Update specific photo
            const newPhotos = [...articleData.photos];
            newPhotos[currentPhotoIndex] = {
              ...newPhotos[currentPhotoIndex],
              src: selectedUrls[0],
            };
            setArticleData((prev) => ({
              ...prev,
              photos: newPhotos,
            }));
            setCurrentPhotoIndex(null);
          }
          setMediaPickerOpen(false);
        }}
        mode={isAddingMultiplePhotos ? "multiple" : "single"}
        allowedTypes={["images"]}
        initialFilter="images"
      />
    </div>
  );
}
