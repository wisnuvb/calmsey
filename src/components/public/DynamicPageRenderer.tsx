"use client";

import React from "react";
import { PageSection } from "@/types/page-builder";
import SectionRenderer from "./SectionRenderer";
import LandingPageMissing from "../setup/LandingPageMissing";

interface DynamicPageRendererProps {
  page: {
    id: string;
    slug: string;
    status: string;
    template: string;
    translations: Array<{
      title: string;
      content: string;
      excerpt?: string;
      seoTitle?: string;
      seoDescription?: string;
    }>;
    sections: PageSection[];
  } | null;
  language: string;
}

export function DynamicPageRenderer({
  page,
  language,
}: DynamicPageRendererProps) {
  if (!page) {
    return <LandingPageMissing language={language} />;
  }

  const activeSections = page.sections
    .filter((section) => section.isActive)
    .sort((a, b) => a.order - b.order);

  if (activeSections.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No Content Available
          </h1>
          <p className="text-gray-600">
            This page exists but has no content sections configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dynamic-page">
      {activeSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          language={language}
          isPublic={true}
          isPreview={false}
        />
      ))}
    </div>
  );
}
