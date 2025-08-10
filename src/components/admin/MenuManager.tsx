/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/MenuManager.tsx
"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PlusIcon,
  TrashIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  HomeIcon,
  DocumentTextIcon,
  FolderIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

interface MenuItem {
  id: string;
  title: string;
  url?: string;
  type: "HOME" | "PAGE" | "CATEGORY" | "CUSTOM";
  target: "SELF" | "BLANK";
  parentId?: string;
  order: number;
  isActive: boolean;
  children?: MenuItem[];
  // References
  pageId?: string;
  categoryId?: string;
}

interface MenuManagerProps {
  menuType: "main-navigation" | "footer-links";
  initialItems?: MenuItem[];
  onSave: (items: MenuItem[]) => void;
}

// Sortable Menu Item Component
function SortableMenuItem({
  item,
  onUpdate,
  onRemove,
  availablePages,
  availableCategories,
}: {
  item: MenuItem;
  onUpdate: (updates: Partial<MenuItem>) => void;
  onRemove: () => void;
  availablePages: any[];
  availableCategories: any[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-gray-200 rounded-lg ${
        isDragging ? "shadow-lg opacity-50" : ""
      }`}
    >
      <MenuItemEditor
        item={item}
        onUpdate={onUpdate}
        onRemove={onRemove}
        dragHandleProps={{ ...attributes, ...listeners }}
        availablePages={availablePages}
        availableCategories={availableCategories}
      />
    </div>
  );
}

export default function MenuManager({
  menuType,
  initialItems = [],
  onSave,
}: MenuManagerProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialItems);
  const [availablePages, setAvailablePages] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchAvailableContent();
  }, []);

  const fetchAvailableContent = async () => {
    try {
      const [pagesRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/pages"),
        fetch("/api/admin/categories"),
      ]);

      const pages = await pagesRes.json();
      const categories = await categoriesRes.json();

      setAvailablePages(pages.data || []);
      setAvailableCategories(categories.data || []);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
  };

  const addMenuItem = (itemData: Partial<MenuItem>) => {
    const newItem: MenuItem = {
      id: `temp-${Date.now()}`, // ✅ Use temporary ID for new items
      title: itemData.title || "New Menu Item",
      type: itemData.type || "CUSTOM",
      target: "SELF",
      order: menuItems.length,
      isActive: true,
      ...itemData,
    };

    setMenuItems([...menuItems, newItem]);
    setShowAddMenu(false);
  };

  const updateMenuItem = (itemId: string, updates: Partial<MenuItem>) => {
    setMenuItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
    );
  };

  const removeMenuItem = (itemId: string) => {
    setMenuItems((items) => items.filter((item) => item.id !== itemId));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setMenuItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      // Use arrayMove helper from @dnd-kit/sortable
      const reorderedItems = arrayMove(items, oldIndex, newIndex);

      // Update order property
      return reorderedItems.map((item, index) => ({
        ...item,
        order: index,
      }));
    });
  };

  // const toggleExpanded = (itemId: string) => {
  //   const newExpanded = new Set(expandedItems);
  //   if (newExpanded.has(itemId)) {
  //     newExpanded.delete(itemId);
  //   } else {
  //     newExpanded.add(itemId);
  //   }
  //   setExpandedItems(newExpanded);
  // };

  const handleSave = () => {
    // Clean up items data before sending
    const cleanedItems = menuItems.map((item, index) => ({
      // Always include id, use temporary ID if not a real database ID
      id: item.id || `temp-${Date.now()}-${index}`,
      title: item.title,
      url: item.url,
      type: item.type,
      target: item.target,
      parentId: item.parentId,
      order: index, // Use index for consistent ordering
      isActive: item.isActive,
      categoryId: item.categoryId,
      pageId: item.pageId,
      // Add Indonesian title if needed
      // titleId: item.titleId,
    }));

    onSave(cleanedItems);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {menuType === "main-navigation"
                ? "Main Navigation"
                : "Footer Links"}
            </h3>
            <p className="text-sm text-gray-500">
              Drag and drop to reorder menu items
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddMenu(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Menu Item
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Save Menu
            </button>
          </div>
        </div>
      </div>

      {/* Menu Items List */}
      <div className="p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={menuItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {menuItems.map((item) => (
                <SortableMenuItem
                  key={item.id}
                  item={item}
                  onUpdate={(updates) => updateMenuItem(item.id, updates)}
                  onRemove={() => removeMenuItem(item.id)}
                  availablePages={availablePages}
                  availableCategories={availableCategories}
                />
              ))}

              {menuItems.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <LinkIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No menu items yet. Add your first menu item above.</p>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Menu Item Modal */}
      {showAddMenu && (
        <AddMenuItemModal
          onAdd={addMenuItem}
          onClose={() => setShowAddMenu(false)}
          availablePages={availablePages}
          availableCategories={availableCategories}
        />
      )}
    </div>
  );
}

// Menu Item Editor Component
function MenuItemEditor({
  item,
  onUpdate,
  onRemove,
  dragHandleProps,
  availablePages,
  availableCategories,
}: {
  item: MenuItem;
  onUpdate: (updates: Partial<MenuItem>) => void;
  onRemove: () => void;
  dragHandleProps: any;
  availablePages: any[];
  availableCategories: any[];
}) {
  const [expanded, setExpanded] = useState(false);

  const getItemIcon = () => {
    switch (item.type) {
      case "HOME":
        return HomeIcon;
      case "PAGE":
        return DocumentTextIcon;
      case "CATEGORY":
        return FolderIcon;
      default:
        return LinkIcon;
    }
  };

  const Icon = getItemIcon();

  return (
    <div className="bg-white">
      {/* Item Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3 flex-1">
          <div {...dragHandleProps} className="cursor-move">
            <Bars3Icon className="h-5 w-5 text-gray-400" />
          </div>
          <Icon className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{item.title}</span>
              <span className="text-sm text-gray-500">({item.type})</span>
              {!item.isActive && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Inactive
                </span>
              )}
            </div>
            {item.url && (
              <p className="text-sm text-gray-500 mt-1">{item.url}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            {expanded ? (
              <ChevronDownIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-900"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Menu title"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={item.type}
                onChange={(e) => onUpdate({ type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="HOME">Home</option>
                <option value="PAGE">Page</option>
                <option value="CATEGORY">Category</option>
                <option value="CUSTOM">Custom URL</option>
              </select>
            </div>
          </div>

          {/* Dynamic Fields based on Type */}
          {item.type === "CUSTOM" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={item.url || ""}
                onChange={(e) => onUpdate({ url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com or /custom-page"
              />
            </div>
          )}

          {item.type === "PAGE" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Page
              </label>
              <select
                value={item.pageId || ""}
                onChange={(e) => {
                  const selectedPage = availablePages.find(
                    (p) => p.id === e.target.value
                  );
                  onUpdate({
                    pageId: e.target.value,
                    url: selectedPage ? `/${selectedPage.slug}` : "",
                    title: selectedPage ? selectedPage.title : item.title,
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a page...</option>
                {availablePages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {item.type === "CATEGORY" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Category
              </label>
              <select
                value={item.categoryId || ""}
                onChange={(e) => {
                  const selectedCategory = availableCategories.find(
                    (c) => c.id === e.target.value
                  );
                  onUpdate({
                    categoryId: e.target.value,
                    url: selectedCategory
                      ? `/category/${selectedCategory.slug}`
                      : "",
                    title: selectedCategory
                      ? selectedCategory.name
                      : item.title,
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category...</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Target */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target
              </label>
              <select
                value={item.target}
                onChange={(e) => onUpdate({ target: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SELF">Same Window</option>
                <option value="BLANK">New Window</option>
              </select>
            </div>

            {/* Active Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex items-center h-10">
                <input
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) => onUpdate({ isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add Menu Item Modal
function AddMenuItemModal({
  onAdd,
  onClose,
  availablePages,
  availableCategories,
}: {
  onAdd: (itemData: Partial<MenuItem>) => void;
  onClose: () => void;
  availablePages: any[];
  availableCategories: any[];
}) {
  const [formData, setFormData] = useState({
    title: "",
    type: "CUSTOM" as MenuItem["type"], // Ubah ini
    url: "",
    pageId: "",
    categoryId: "",
    target: "SELF" as MenuItem["target"], // Ubah ini juga
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalData = { ...formData };

    // Set URL based on type
    if (formData.type === "HOME") {
      finalData.url = "/";
      finalData.title = formData.title || "Home";
    } else if (formData.type === "PAGE" && formData.pageId) {
      const selectedPage = availablePages.find(
        (p: any) => p.id === formData.pageId
      );
      if (selectedPage) {
        finalData.url = `/${selectedPage.slug}`;
        finalData.title = formData.title || selectedPage.title;
      }
    } else if (formData.type === "CATEGORY" && formData.categoryId) {
      const selectedCategory = availableCategories.find(
        (c: any) => c.id === formData.categoryId
      );
      if (selectedCategory) {
        finalData.url = `/category/${selectedCategory.slug}`;
        finalData.title = formData.title || selectedCategory.name;
      }
    }

    onAdd(finalData);
  };

  const quickMenuItems = [
    { type: "HOME" as const, title: "Home", icon: HomeIcon },
    { type: "CUSTOM" as const, title: "About Us", url: "/about" },
    { type: "CUSTOM" as const, title: "Contact", url: "/contact" },
    { type: "CUSTOM" as const, title: "Services", url: "/services" },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Add Menu Item</h3>
        </div>

        <div className="p-6">
          {/* Quick Add Buttons */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Quick Add
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {quickMenuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onAdd(item)}
                  className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  {item.icon && (
                    <item.icon className="h-5 w-5 mr-2 text-gray-500" />
                  )}
                  <span className="text-sm">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Custom Menu Item
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Menu item title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CUSTOM">Custom URL</option>
                  <option value="HOME">Home</option>
                  <option value="PAGE">Page</option>
                  <option value="CATEGORY">Category</option>
                </select>
              </div>

              {formData.type === "CUSTOM" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/about or https://external-site.com"
                  />
                </div>
              )}

              {formData.type === "PAGE" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Page
                  </label>
                  <select
                    value={formData.pageId}
                    onChange={(e) =>
                      setFormData({ ...formData, pageId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a page...</option>
                    {availablePages.map((page: any) => (
                      <option key={page.id} value={page.id}>
                        {page.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.type === "CATEGORY" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a category...</option>
                    {availableCategories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Add Menu Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
