// src/components/admin/BulkTagOperations.tsx
"use client";

import { useEffect, useState } from "react";
import {
  PlusIcon,
  DocumentPlusIcon,
  TrashIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface BulkTagOperationsProps {
  selectedTagIds: string[];
  tags: Array<{ id: string; name: string; articleCount: number }>;
  onRefresh: () => void;
  onClearSelection: () => void;
}

export default function BulkTagOperations({
  selectedTagIds,
  tags,
  onRefresh,
  onClearSelection,
}: BulkTagOperationsProps) {
  const [showBulkCreate, setShowBulkCreate] = useState(false);
  const [showBulkRename, setShowBulkRename] = useState(false);

  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));
  const totalArticles = selectedTags.reduce(
    (sum, tag) => sum + tag.articleCount,
    0
  );

  const handleBulkDelete = async () => {
    if (selectedTagIds.length === 0) return;

    let confirmMessage = `Delete ${selectedTagIds.length} selected tags?`;
    if (totalArticles > 0) {
      confirmMessage += `\n\nThis will remove these tags from ${totalArticles} articles.`;
    }

    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch("/api/admin/tags/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagIds: selectedTagIds }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        onRefresh();
        onClearSelection();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete tags");
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Failed to delete tags");
    }
  };

  if (selectedTagIds.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-blue-900">
            {selectedTagIds.length} tags selected
          </span>
          {totalArticles > 0 && (
            <span className="text-sm text-blue-700">
              ({totalArticles} article associations)
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBulkCreate(true)}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            title="Create multiple tags"
          >
            <DocumentPlusIcon className="h-4 w-4 mr-1" />
            Bulk Create
          </button>

          <button
            onClick={() => setShowBulkRename(true)}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            title="Rename selected tags"
          >
            <PencilSquareIcon className="h-4 w-4 mr-1" />
            Rename
          </button>

          <button
            onClick={handleBulkDelete}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            title="Delete selected tags"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </button>

          <button
            onClick={onClearSelection}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            title="Clear selection"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bulk Create Modal */}
      {showBulkCreate && (
        <BulkCreateModal
          onClose={() => setShowBulkCreate(false)}
          onSuccess={() => {
            onRefresh();
            setShowBulkCreate(false);
          }}
        />
      )}

      {/* Bulk Rename Modal */}
      {showBulkRename && (
        <BulkRenameModal
          tags={selectedTags}
          onClose={() => setShowBulkRename(false)}
          onSuccess={() => {
            onRefresh();
            setShowBulkRename(false);
            onClearSelection();
          }}
        />
      )}
    </div>
  );
}

// Bulk Create Modal
function BulkCreateModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [tagNames, setTagNames] = useState("");
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const names = tagNames
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length === 0) {
      alert("Please enter at least one tag name");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create tags");
      }
    } catch (error) {
      console.error("Bulk create error:", error);
      alert("Failed to create tags");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Create Multiple Tags
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tag Names (one per line)
            </label>
            <textarea
              value={tagNames}
              onChange={(e) => setTagNames(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Marine Conservation\nSustainable Fishing\nClimate Change\nCommunity Rights\n...`}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter each tag on a new line. Duplicates will be automatically
              skipped.
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
              disabled={creating || !tagNames.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Tags"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Bulk Rename Modal
function BulkRenameModal({
  tags,
  onClose,
  onSuccess,
}: {
  tags: Array<{ id: string; name: string; articleCount: number }>;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [newNames, setNewNames] = useState<Record<string, string>>(
    tags.reduce((acc, tag) => ({ ...acc, [tag.id]: tag.name }), {})
  );
  const [renaming, setRenaming] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagIds = tags.map((tag) => tag.id);
    const nameValues = tags.map((tag) => newNames[tag.id]);

    // Check if all names are provided
    if (nameValues.some((name) => !name.trim())) {
      alert("Please provide names for all tags");
      return;
    }

    setRenaming(true);
    try {
      const response = await fetch("/api/admin/tags/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "rename",
          tagIds,
          newNames: nameValues,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to rename tags");
      }
    } catch (error) {
      console.error("Bulk rename error:", error);
      alert("Failed to rename tags");
    } finally {
      setRenaming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Rename {tags.length} Tags
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4 mb-6">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-16 text-sm text-gray-500">
                  {tag.articleCount} uses
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newNames[tag.id]}
                    onChange={(e) =>
                      setNewNames((prev) => ({
                        ...prev,
                        [tag.id]: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tag name"
                    required
                  />
                </div>
              </div>
            ))}
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
              disabled={renaming}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {renaming ? "Renaming..." : "Rename Tags"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// src/components/admin/TagSuggestions.tsx - Tag suggestions component
interface TagSuggestionsProps {
  query: string;
  onSelectTag: (tag: { id: string; name: string }) => void;
  className?: string;
}

export function TagSuggestions({
  query,
  onSelectTag,
  className = "",
}: TagSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<
    Array<{ id: string; name: string; articleCount: number }>
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/admin/tags/suggestions?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setSuggestions(data.data || []);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  if (!query.trim() || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      className={`absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto ${className}`}
    >
      {loading ? (
        <div className="p-3 text-center text-gray-500">Loading...</div>
      ) : (
        suggestions.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onSelectTag(tag)}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center justify-between"
          >
            <span className="font-medium">{tag.name}</span>
            <span className="text-xs text-gray-500">
              {tag.articleCount} uses
            </span>
          </button>
        ))
      )}
    </div>
  );
}
