/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface Tag {
  id: string;
  name: string;
  articleCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "articleCount" | "createdAt">(
    "name"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<"all" | "used" | "unused">("all");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [bulkActionMode, setBulkActionMode] = useState(false);

  useEffect(() => {
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortBy, sortOrder, filter]);

  const fetchTags = async () => {
    try {
      const params = new URLSearchParams({
        search,
        sortBy,
        sortOrder,
        filter: filter === "all" ? "" : filter,
      });

      const response = await fetch(`/api/admin/tags?${params}`);
      const data = await response.json();
      setTags(data.data || []);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTag = async (tagId: string, tagName: string) => {
    const tag = tags.find((t) => t.id === tagId);

    if (tag?.articleCount && tag.articleCount > 0) {
      if (
        !confirm(
          `"${tagName}" is used in ${tag.articleCount} articles. Deleting this tag will remove it from all articles. Continue?`
        )
      ) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to delete "${tagName}"?`)) {
        return;
      }
    }

    try {
      const response = await fetch(`/api/admin/tags/${tagId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTags();
        setSelectedTags((prev) => {
          const newSet = new Set(prev);
          newSet.delete(tagId);
          return newSet;
        });
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete tag");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete tag");
    }
  };

  const bulkDeleteTags = async () => {
    if (selectedTags.size === 0) return;

    const tagsToDelete = tags.filter((tag) => selectedTags.has(tag.id));
    const usedTags = tagsToDelete.filter((tag) => tag.articleCount > 0);

    let confirmMessage = `Delete ${selectedTags.size} selected tags?`;
    if (usedTags.length > 0) {
      confirmMessage += `\n\n${usedTags.length} of these tags are currently used in articles and will be removed from all articles.`;
    }

    if (!confirm(confirmMessage)) return;

    try {
      const promises = Array.from(selectedTags).map((tagId) =>
        fetch(`/api/admin/tags/${tagId}`, { method: "DELETE" })
      );

      await Promise.all(promises);
      fetchTags();
      setSelectedTags(new Set());
      setBulkActionMode(false);
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Failed to delete some tags");
    }
  };

  const toggleTagSelection = (tagId: string) => {
    const newSet = new Set(selectedTags);
    if (newSet.has(tagId)) {
      newSet.delete(tagId);
    } else {
      newSet.add(tagId);
    }
    setSelectedTags(newSet);
  };

  const selectAllTags = () => {
    if (selectedTags.size === filteredTags.length) {
      setSelectedTags(new Set());
    } else {
      setSelectedTags(new Set(filteredTags.map((tag) => tag.id)));
    }
  };

  const openCreateModal = () => {
    setEditingTag(null);
    setShowCreateModal(true);
  };

  const openEditModal = (tag: Tag) => {
    setEditingTag(tag);
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingTag(null);
  };

  const handleSave = () => {
    fetchTags();
    closeModal();
  };

  // Filter and sort tags
  const filteredTags = tags.filter((tag) => {
    if (filter === "used" && tag.articleCount === 0) return false;
    if (filter === "unused" && tag.articleCount > 0) return false;
    return true;
  });

  const sortedTags = [...filteredTags].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "articleCount":
        comparison = a.articleCount - b.articleCount;
        break;
      case "createdAt":
        comparison =
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime();
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
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
          <h1 className="text-2xl font-semibold text-gray-900">Tags</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage tags to categorize and organize your articles.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
          {bulkActionMode && selectedTags.size > 0 && (
            <>
              <button
                onClick={bulkDeleteTags}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Selected ({selectedTags.size})
              </button>
              <button
                onClick={() => {
                  setBulkActionMode(false);
                  setSelectedTags(new Set());
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            </>
          )}

          {!bulkActionMode && (
            <>
              <button
                onClick={() => setBulkActionMode(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Bulk Actions
              </button>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Tag
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mt-6 bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tags</option>
            <option value="used">Used Tags</option>
            <option value="unused">Unused Tags</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="articleCount">Sort by Usage</option>
            <option value="createdAt">Sort by Date</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Bulk Selection Header */}
      {bulkActionMode && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={
                  selectedTags.size === sortedTags.length &&
                  sortedTags.length > 0
                }
                onChange={selectAllTags}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-blue-900">
                Select All ({sortedTags.length} tags)
              </span>
            </div>
            <span className="text-sm text-blue-700">
              {selectedTags.size} selected
            </span>
          </div>
        </div>
      )}

      {/* Tags Grid */}
      <div className="mt-6">
        {sortedTags.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedTags.map((tag) => (
              <TagCard
                key={tag.id}
                tag={tag}
                selected={selectedTags.has(tag.id)}
                bulkMode={bulkActionMode}
                onSelect={() => toggleTagSelection(tag.id)}
                onEdit={() => openEditModal(tag)}
                onDelete={() => deleteTag(tag.id, tag.name)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <TagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {search || filter !== "all" ? "No tags found" : "No tags yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {search || filter !== "all"
                ? "Try adjusting your search or filters."
                : "Create your first tag to start organizing your articles."}
            </p>
            {!search && filter === "all" && (
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Tag
              </button>
            )}
          </div>
        )}
      </div>

      {/* Statistics */}
      {tags.length > 0 && <TagsStatistics tags={tags} />}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <TagModal tag={editingTag} onSave={handleSave} onClose={closeModal} />
      )}
    </div>
  );
}

// Tag Card Component
function TagCard({
  tag,
  selected,
  bulkMode,
  onSelect,
  onEdit,
  onDelete,
}: {
  tag: Tag;
  selected: boolean;
  bulkMode: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const getUsageColor = () => {
    if (tag.articleCount === 0) return "text-gray-500 bg-gray-100";
    if (tag.articleCount < 5) return "text-yellow-700 bg-yellow-100";
    if (tag.articleCount < 10) return "text-blue-700 bg-blue-100";
    return "text-green-700 bg-green-100";
  };

  return (
    <div
      className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
        selected ? "ring-2 ring-blue-500 border-blue-300" : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {bulkMode && (
            <div className="mb-3">
              <input
                type="checkbox"
                checked={selected}
                onChange={onSelect}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          )}

          <div className="flex items-center space-x-2 mb-2">
            <TagIcon className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {tag.name}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUsageColor()}`}
            >
              {tag.articleCount} articles
            </span>

            {!bulkMode && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={onEdit}
                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                  title="Edit tag"
                >
                  <PencilIcon className="h-3 w-3" />
                </button>
                <button
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                  title="Delete tag"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tag Modal Component
function TagModal({
  tag,
  onSave,
  onClose,
}: {
  tag: Tag | null;
  onSave: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(tag?.name || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a tag name");
      return;
    }

    setSaving(true);
    try {
      const url = tag ? `/api/admin/tags/${tag.id}` : "/api/admin/tags";
      const method = tag ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (response.ok) {
        onSave();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save tag");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save tag");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {tag ? "Edit Tag" : "Create New Tag"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tag Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tag name"
              required
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Use descriptive keywords that help categorize your content.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : tag ? "Update" : "Create"} Tag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Tags Statistics Component
function TagsStatistics({ tags }: { tags: Tag[] }) {
  const totalTags = tags.length;
  const usedTags = tags.filter((tag) => tag.articleCount > 0).length;
  const unusedTags = totalTags - usedTags;
  const totalUsage = tags.reduce((sum, tag) => sum + tag.articleCount, 0);
  const averageUsage =
    totalTags > 0 ? (totalUsage / totalTags).toFixed(1) : "0";
  const mostUsedTag = tags.reduce(
    (max, tag) => (tag.articleCount > max.articleCount ? tag : max),
    tags[0]
  );

  return (
    <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <ChartBarIcon className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Tag Statistics</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalTags}</div>
          <div className="text-sm text-gray-600">Total Tags</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{usedTags}</div>
          <div className="text-sm text-gray-600">Used Tags</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{unusedTags}</div>
          <div className="text-sm text-gray-600">Unused Tags</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {averageUsage}
          </div>
          <div className="text-sm text-gray-600">Avg Usage</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div
            className="text-lg font-bold text-orange-600 truncate"
            title={mostUsedTag?.name}
          >
            {mostUsedTag?.name.substring(0, 10)}
            {mostUsedTag?.name.length > 10 ? "..." : ""}
          </div>
          <div className="text-sm text-gray-600">Most Used</div>
        </div>
      </div>

      {unusedTags > 0 && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            💡 You have {unusedTags} unused tags. Consider removing them or
            using them in your articles.
          </p>
        </div>
      )}
    </div>
  );
}
