// src/app/admin/categories/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  FolderOpenIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import TranslationTabs from "@/components/admin/TranslationTabs";

interface CategoryTranslation {
  languageId: string;
  name: string;
  description?: string;
}

interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  parentId?: string;
  order: number;
  articleCount: number;
  createdAt: string;
  updatedAt: string;
  parent?: {
    id: string;
    name: string;
    slug: string;
  };
  children?: Category[];
  translations?: CategoryTranslation[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories?hierarchy=true");
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId: string, categoryName: string) => {
    const category = categories.find((c) => c.id === categoryId);

    if (category?.articleCount && category.articleCount > 0) {
      if (
        !confirm(
          `"${categoryName}" has ${category.articleCount} articles. Deleting this category will unlink it from all articles. Continue?`
        )
      ) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) {
        return;
      }
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCategories(); // Refresh list
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete category");
    }
  };

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleSave = () => {
    fetchCategories();
    closeModal();
  };

  // Organize categories into hierarchy
  const organizeHierarchy = (categories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // First pass: create map
    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build hierarchy
    categories.forEach((category) => {
      const categoryWithChildren = categoryMap.get(category.id)!;

      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children!.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  };

  const renderCategoryTree = (categories: Category[], level = 0) => {
    return categories.map((category) => (
      <div key={category.id}>
        <CategoryRow
          category={category}
          level={level}
          expanded={expandedCategories.has(category.id)}
          onToggleExpanded={() => toggleExpanded(category.id)}
          onEdit={() => openEditModal(category)}
          onDelete={() => deleteCategory(category.id, category.name)}
          onAddChild={() => openCreateModal()}
        />
        {category.children &&
          category.children.length > 0 &&
          expandedCategories.has(category.id) && (
            <div className="ml-6">
              {renderCategoryTree(category.children, level + 1)}
            </div>
          )}
      </div>
    ));
  };

  const hierarchicalCategories = organizeHierarchy(categories);

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
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="mt-2 text-sm text-gray-700">
            Organize your content with hierarchical categories and
            multi-language support.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => openCreateModal()}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Tree */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        {hierarchicalCategories.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {renderCategoryTree(hierarchicalCategories)}
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first category to start organizing your content.
            </p>
            <button
              onClick={() => openCreateModal()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Category
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      {hierarchicalCategories.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {categories.length}
              </div>
              <div className="text-sm text-blue-800">Total Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {categories.filter((c) => !c.parentId).length}
              </div>
              <div className="text-sm text-blue-800">Root Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {categories.reduce((sum, c) => sum + (c.articleCount || 0), 0)}
              </div>
              <div className="text-sm text-blue-800">Total Articles</div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <CategoryModal
          category={editingCategory}
          parentCategories={categories.filter((c) => !c.parentId)} // Only root categories can be parents
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

// Category Row Component
function CategoryRow({
  category,
  level,
  expanded,
  onToggleExpanded,
  onEdit,
  onDelete,
  onAddChild,
}: {
  category: Category;
  level: number;
  expanded: boolean;
  onToggleExpanded: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddChild: () => void;
}) {
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div
      className={`flex items-center justify-between p-4 hover:bg-gray-50 ${
        level > 0 ? "border-l-2 border-gray-200" : ""
      }`}
    >
      <div className="flex items-center flex-1">
        {/* Hierarchy Indicator */}
        <div className="flex items-center mr-3">
          {hasChildren ? (
            <button
              onClick={onToggleExpanded}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {expanded ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-6 h-6" /> // Spacer
          )}

          {hasChildren ? (
            expanded ? (
              <FolderOpenIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <FolderIcon className="h-5 w-5 text-yellow-500" />
            )
          ) : (
            <FolderIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {/* Category Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900">
              {category.name}
            </h3>
            {category.parent && (
              <span className="text-xs text-gray-500">
                in {category.parent.name}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-xs text-gray-500">/{category.slug}</span>
            <span className="text-xs text-gray-500">
              {category.articleCount} articles
            </span>
            {level > 0 && (
              <span className="text-xs text-blue-600">Level {level + 1}</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onAddChild}
          className="text-green-600 hover:text-green-900"
          title="Add subcategory"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-900"
          title="Edit category"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-900"
          title="Delete category"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Category Modal Component
function CategoryModal({
  category,
  parentCategories,
  onSave,
  onClose,
}: {
  category: Category | null;
  parentCategories: Category[];
  onSave: () => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    slug: category?.slug || "",
    parentId: category?.parentId || "",
    order: category?.order || 0,
  });

  const [translations, setTranslations] = useState<CategoryTranslation[]>(
    category?.translations || [{ languageId: "en", name: "", description: "" }]
  );

  const [saving, setSaving] = useState(false);

  // Auto-generate slug from English name
  useEffect(() => {
    const englishTranslation = translations.find((t) => t.languageId === "en");
    if (englishTranslation?.name && !category) {
      // Only auto-generate for new categories
      const slug = englishTranslation.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [translations, category]);

  const updateTranslation = (
    languageId: string,
    data: Partial<CategoryTranslation>
  ) => {
    setTranslations((prev) =>
      prev.map((t) => (t.languageId === languageId ? { ...t, ...data } : t))
    );
  };

  const addTranslation = (languageId: string) => {
    const newTranslation: CategoryTranslation = {
      languageId,
      name: "",
      description: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const englishTranslation = translations.find((t) => t.languageId === "en");
    if (!englishTranslation?.name.trim()) {
      alert("Please enter a name for the English version");
      return;
    }

    setSaving(true);
    try {
      const url = category
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories";

      const method = category ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: formData.slug,
          parentId: formData.parentId || null,
          order: formData.order,
          translations: translations.filter((t) => t.name.trim()),
        }),
      });

      if (response.ok) {
        onSave();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save category");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {category ? "Edit Category" : "Create New Category"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="category-slug"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category
              </label>
              <select
                value={formData.parentId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, parentId: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Parent (Root Category)</option>
                {parentCategories.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    order: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>

          {/* Translations */}
          <div className="border-t pt-6">
            <TranslationTabs
              translations={translations.map((t) => ({
                ...t,
                title: t.name,
                content: t.description || "",
              }))}
              onUpdateTranslation={(languageId, data) => {
                updateTranslation(languageId, {
                  name: data.title || "",
                  description: data.content || "",
                });
              }}
              onAddTranslation={addTranslation}
              onRemoveTranslation={removeTranslation}
              contentType="category"
            >
              {(activeLanguage, translation) => (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={translation?.title || ""}
                      onChange={(e) =>
                        updateTranslation(activeLanguage, {
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Category name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={translation?.content || ""}
                      onChange={(e) =>
                        updateTranslation(activeLanguage, {
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Category description"
                    />
                  </div>
                </div>
              )}
            </TranslationTabs>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : category ? "Update" : "Create"} Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
