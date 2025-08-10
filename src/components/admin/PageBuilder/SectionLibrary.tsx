"use client";

import React, { useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

import { PageSectionType, SectionCategory } from "@/types/page-builder";
import {
  SectionRegistry,
  SECTION_CATEGORIES,
} from "@/lib/page-builder/section-registry";

interface SectionLibraryProps {
  onAddSection: (sectionType: PageSectionType, insertIndex?: number) => void;
  categories: typeof SECTION_CATEGORIES;
  searchable?: boolean;
  showAdvanced?: boolean;
  insertIndex?: number;
}

export default function SectionLibrary({
  onAddSection,
  categories,
  searchable = true,
  showAdvanced = true,
  insertIndex,
}: SectionLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    SectionCategory | "all"
  >("all");
  const [showAdvancedOnly, setShowAdvancedOnly] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Set<SectionCategory>
  >(new Set([SectionCategory.CONTENT, SectionCategory.LAYOUT]));

  // Get all sections and apply filters
  const filteredSections = useMemo(() => {
    let sections = SectionRegistry.getAllSections();

    // Apply search filter
    if (searchQuery.trim()) {
      sections = SectionRegistry.searchSections(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      sections = sections.filter(
        (section) => section.category === selectedCategory
      );
    }

    // Apply advanced filter
    if (showAdvancedOnly) {
      sections = sections.filter((section) => section.isAdvanced);
    }

    return sections;
  }, [searchQuery, selectedCategory, showAdvancedOnly]);

  // Group sections by category
  const sectionsByCategory = useMemo(() => {
    const grouped = new Map<SectionCategory, typeof filteredSections>();

    categories.forEach((category) => {
      const categorySections = filteredSections.filter(
        (section) => section.category === category.key
      );
      if (categorySections.length > 0) {
        grouped.set(category.key, categorySections);
      }
    });

    return grouped;
  }, [filteredSections, categories]);

  const toggleCategory = (category: SectionCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSectionClick = (sectionType: PageSectionType) => {
    onAddSection(sectionType, insertIndex);
  };

  const renderSearchAndFilters = () => (
    <div className="p-4 border-b border-gray-200 space-y-3">
      {/* Search Input */}
      {searchable && (
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center space-x-2">
        <FunnelIcon className="h-4 w-4 text-gray-400" />
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value as SectionCategory | "all")
          }
          className="flex-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.key} value={category.key}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Advanced Filter */}
      {showAdvanced && (
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={showAdvancedOnly}
              onChange={(e) => setShowAdvancedOnly(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">Advanced sections only</span>
          </label>
          <AcademicCapIcon className="h-4 w-4 text-gray-400" />
        </div>
      )}

      {/* Results Count */}
      <div className="text-xs text-gray-500">
        {filteredSections.length} section
        {filteredSections.length !== 1 ? "s" : ""} found
      </div>
    </div>
  );

  const renderSectionCard = (section: (typeof filteredSections)[0]) => (
    <button
      key={section.type}
      onClick={() => handleSectionClick(section.type)}
      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
    >
      <div className="flex items-start space-x-3">
        {/* Section Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg group-hover:bg-blue-100 transition-colors">
            {section.icon}
          </div>
        </div>

        {/* Section Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {section.name}
            </h4>
            {section.isAdvanced && (
              <SparklesIcon
                className="h-3 w-3 text-yellow-500"
                title="Advanced Section"
              />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {section.description}
          </p>

          {/* Section Tags */}
          <div className="flex items-center justify-between mt-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(
                section.category
              )}`}
            >
              {section.category}
            </span>
            {section.isAdvanced && (
              <span className="text-xs text-yellow-600 font-medium">
                Advanced
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );

  const renderCategorySection = (
    category: (typeof categories)[0],
    sections: typeof filteredSections
  ) => (
    <div
      key={category.key}
      className="border-b border-gray-100 last:border-b-0"
    >
      {/* Category Header */}
      <button
        onClick={() => toggleCategory(category.key)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">{category.icon}</span>
          <div className="text-left">
            <h3 className="text-sm font-medium text-gray-900">
              {category.name}
            </h3>
            <p className="text-xs text-gray-500">
              {sections.length} section{sections.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div
          className={`transform transition-transform ${
            expandedCategories.has(category.key) ? "rotate-180" : ""
          }`}
        >
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Category Sections */}
      {expandedCategories.has(category.key) && (
        <div className="px-4 pb-4 space-y-2">
          {sections.map(renderSectionCard)}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {renderSearchAndFilters()}

      <div className="flex-1 overflow-y-auto">
        {filteredSections.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              No sections found
            </h3>
            <p className="text-xs text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : selectedCategory === "all" ? (
          // Show grouped by categories
          <div>
            {Array.from(sectionsByCategory.entries()).map(
              ([categoryKey, sections]) => {
                const category = categories.find((c) => c.key === categoryKey);
                return category
                  ? renderCategorySection(category, sections)
                  : null;
              }
            )}
          </div>
        ) : (
          // Show flat list for specific category
          <div className="p-4 space-y-2">
            {filteredSections.map(renderSectionCard)}
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500 mb-2">Quick Add:</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { type: PageSectionType.HERO, label: "Hero", icon: "🚀" },
            { type: PageSectionType.RICH_TEXT, label: "Text", icon: "📝" },
            { type: PageSectionType.IMAGE, label: "Image", icon: "🖼️" },
            { type: PageSectionType.CONTACT_FORM, label: "Form", icon: "📧" },
          ].map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => handleSectionClick(type)}
              className="flex items-center space-x-2 p-2 text-xs text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to get category color classes
function getCategoryColor(category: SectionCategory): string {
  const colorMap: Record<SectionCategory, string> = {
    [SectionCategory.LAYOUT]: "bg-blue-100 text-blue-800",
    [SectionCategory.CONTENT]: "bg-green-100 text-green-800",
    [SectionCategory.INTERACTIVE]: "bg-purple-100 text-purple-800",
    [SectionCategory.DYNAMIC]: "bg-orange-100 text-orange-800",
    [SectionCategory.SOCIAL]: "bg-pink-100 text-pink-800",
    [SectionCategory.ADVANCED]: "bg-red-100 text-red-800",
    [SectionCategory.CUSTOM]: "bg-gray-100 text-gray-800",
  };

  return colorMap[category] || "bg-gray-100 text-gray-800";
}
