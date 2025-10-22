/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/pages/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageSection, PageSectionType } from "@/types/page-builder";
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
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
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

        // Set sections if they exist, otherwise create default section
        if (page.sections && page.sections.length > 0) {
          const formattedSections = page.sections.map(
            (section: any, index: number) => ({
              id: section.id,
              type: section.type as PageSectionType,
              order: index,
              isActive: section.isActive !== false,
              layoutSettings: section.layoutSettings
                ? JSON.parse(section.layoutSettings)
                : {
                    width: "container",
                    padding: { top: "2rem", bottom: "2rem" },
                    alignment: "center",
                  },
              styleSettings: section.styleSettings
                ? JSON.parse(section.styleSettings)
                : {
                    background: { type: "none" },
                    textColor: "#333333",
                  },
              responsiveSettings: section.responsiveSettings
                ? JSON.parse(section.responsiveSettings)
                : {
                    desktop: { visibility: "visible" },
                    tablet: { visibility: "visible" },
                    mobile: { visibility: "visible" },
                  },
              animationSettings: section.animationSettings
                ? JSON.parse(section.animationSettings)
                : {
                    entrance: {
                      enabled: false,
                      type: "none",
                      duration: 300,
                      delay: 0,
                      easing: "ease",
                    },
                    scroll: {
                      enabled: false,
                      type: "none",
                      trigger: "viewport",
                      triggerOffset: 0,
                      speed: 1,
                    },
                    hover: {
                      enabled: false,
                      type: "none",
                      duration: 200,
                      easing: "ease",
                    },
                    custom: [],
                    enabled: false,
                    customCode: "",
                  },
              contentSettings: section.contentSettings
                ? JSON.parse(section.contentSettings)
                : {},
              customSettings: section.customSettings
                ? JSON.parse(section.customSettings)
                : {
                    cssClasses: [],
                    customCSS: "",
                    customJS: "",
                    attributes: {},
                    seoSettings: {
                      enableStructuredData: false,
                      noIndex: false,
                      noFollow: false,
                    },
                    accessibilitySettings: {
                      enableKeyboardNavigation: true,
                      enableScreenReaderSupport: true,
                      highContrast: false,
                      reducedMotion: false,
                    },
                  },
              translations: section.translations || [
                {
                  languageId: "en",
                  title: section.translations?.[0]?.title || "",
                  content: section.translations?.[0]?.content || "",
                  metadata: section.translations?.[0]?.customData || {},
                },
              ],
            })
          );
          setSections(formattedSections);
        } else {
          // Create a default hero section if no sections exist
          setSections([
            {
              id: "default-hero",
              type: PageSectionType.HERO,
              order: 0,
              isActive: true,
              layoutSettings: {
                width: "full",
                padding: { top: "4rem", bottom: "4rem" },
                alignment: "center",
                margin: {
                  top: "0",
                  right: "0",
                  bottom: "0",
                  left: "0",
                  unit: "px",
                },
                verticalAlignment: "top",
                display: "block",
              },
              styleSettings: {
                background: { type: "color", color: "#f8fafc" },
                textColor: "#1f2937",
              },
              responsiveSettings: {
                desktop: { visibility: "visible" },
                tablet: { visibility: "visible" },
                mobile: { visibility: "visible" },
              },
              animationSettings: {
                entrance: {
                  enabled: false,
                  type: "none",
                  duration: 300,
                  delay: 0,
                  easing: "ease",
                },
                scroll: {
                  enabled: false,
                  type: "none",
                  trigger: "viewport",
                  triggerOffset: 0,
                  speed: 1,
                },
                hover: {
                  enabled: false,
                  type: "none",
                  duration: 200,
                  easing: "ease",
                },
                custom: [],
                enabled: false,
                customCode: "",
              },
              contentSettings: {},
              customSettings: {
                cssClasses: [],
                customCSS: "",
                customJS: "",
                attributes: {},
                seoSettings: {
                  enableStructuredData: false,
                  noIndex: false,
                  noFollow: false,
                },
                accessibilitySettings: {
                  enableKeyboardNavigation: true,
                  enableScreenReaderSupport: true,
                  highContrast: false,
                  reducedMotion: false,
                },
              },
              translations: [
                {
                  languageId: "en",
                  title: pageData.title || "Welcome",
                  content: "This is your page content. Click to edit.",
                  metadata: {},
                },
              ],
            },
          ]);
        }
      } else {
        setError("Failed to load page");
      }
    } catch (error) {
      console.error("Error fetching page:", error);
      setError("Error loading page");
    } finally {
      setLoading(false);
    }
  };

  const handleSectionsChange = (updatedSections: PageSection[]) => {
    setSections(updatedSections);
  };

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSectionId(sectionId);
  };

  const handleSectionAdd = (
    sectionType: PageSectionType,
    afterSectionId?: string
  ) => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type: sectionType,
      order: sections.length,
      isActive: true,
      layoutSettings: {
        width: "container",
        padding: { top: "2rem", bottom: "2rem" },
        alignment: "center",
        margin: { top: "0", right: "0", bottom: "0", left: "0", unit: "px" },
        verticalAlignment: "top",
        display: "block",
      },
      styleSettings: {
        background: { type: "none" },
        textColor: "#333333",
      },
      responsiveSettings: {
        desktop: { visibility: "visible" },
        tablet: { visibility: "visible" },
        mobile: { visibility: "visible" },
      },
      animationSettings: {
        entrance: {
          enabled: false,
          type: "none",
          duration: 300,
          delay: 0,
          easing: "ease",
        },
        scroll: {
          enabled: false,
          type: "none",
          trigger: "viewport",
          triggerOffset: 0,
          speed: 1,
        },
        hover: {
          enabled: false,
          type: "none",
          duration: 200,
          easing: "ease",
        },
        custom: [],
        enabled: false,
        customCode: "",
      },
      contentSettings: {},
      customSettings: {
        cssClasses: [],
        customCSS: "",
        customJS: "",
        attributes: {},
        seoSettings: {
          enableStructuredData: false,
          noIndex: false,
          noFollow: false,
        },
        accessibilitySettings: {
          enableKeyboardNavigation: true,
          enableScreenReaderSupport: true,
          highContrast: false,
          reducedMotion: false,
        },
      },
      translations: [
        {
          languageId: "en",
          title: "New Section",
          content: "Add your content here",
          metadata: {},
        },
      ],
    };

    let updatedSections = [...sections];
    if (afterSectionId) {
      const insertIndex =
        sections.findIndex((s) => s.id === afterSectionId) + 1;
      updatedSections.splice(insertIndex, 0, newSection);
    } else {
      updatedSections.push(newSection);
    }

    // Reorder sections
    updatedSections = updatedSections.map((section, index) => ({
      ...section,
      order: index,
    }));

    setSections(updatedSections);
  };

  const handleSectionDelete = (sectionId: string) => {
    const updatedSections = sections
      .filter((s) => s.id !== sectionId)
      .map((section, index) => ({ ...section, order: index }));
    setSections(updatedSections);
  };

  const handleSectionDuplicate = (sectionId: string) => {
    const sectionToDuplicate = sections.find((s) => s.id === sectionId);
    if (!sectionToDuplicate) return;

    const duplicatedSection: PageSection = {
      ...sectionToDuplicate,
      id: `section-${Date.now()}`,
      translations: sectionToDuplicate.translations.map((translation) => ({
        ...translation,
        title: translation.title ? `${translation.title} (Copy)` : undefined,
      })),
    };

    const insertIndex = sections.findIndex((s) => s.id === sectionId) + 1;
    const updatedSections = [...sections];
    updatedSections.splice(insertIndex, 0, duplicatedSection);

    // Reorder sections
    const reorderedSections = updatedSections.map((section, index) => ({
      ...section,
      order: index,
    }));

    setSections(reorderedSections);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...pageData,
          sections: sections.map((section) => ({
            id: section.id,
            type: section.type,
            order: section.order,
            isActive: section.isActive,
            layoutSettings: JSON.stringify(section.layoutSettings),
            styleSettings: JSON.stringify(section.styleSettings),
            responsiveSettings: JSON.stringify(section.responsiveSettings),
            animationSettings: JSON.stringify(section.animationSettings),
            contentSettings: JSON.stringify(section.contentSettings),
            customSettings: JSON.stringify(section.customSettings),
            translations: section.translations,
          })),
        }),
      });

      if (response.ok) {
        alert("Page updated successfully!");
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="py-4">
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
              <p className="mt-1 text-sm text-gray-600">
                Use the page builder below to edit your content and apply
                brandkits
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
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Builder with Brandkit Integration */}
      <PageBuilderWithBrandkit
        pageId={pageId}
        sections={sections}
        selectedSectionId={selectedSectionId}
        onSectionsChange={handleSectionsChange}
        onSectionSelect={handleSectionSelect}
        onSectionAdd={handleSectionAdd}
        onSectionDelete={handleSectionDelete}
        onSectionDuplicate={handleSectionDuplicate}
        onSave={handleSave}
        className="h-[calc(100vh-120px)]"
      />
    </div>
  );
}
