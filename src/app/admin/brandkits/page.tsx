/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/brandkits/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlusIcon,
  SwatchIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Brandkit } from "@/types/brandkit";

interface BrandkitStats {
  total: number;
  active: number;
  public: number;
  private: number;
}

export default function BrandkitsAdminPage() {
  const [brandkits, setBrandkits] = useState<Brandkit[]>([]);
  const [stats, setStats] = useState<BrandkitStats>({
    total: 0,
    active: 0,
    public: 0,
    private: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [filterVisibility, setFilterVisibility] = useState<
    "all" | "public" | "private"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "usageCount">(
    "name"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchBrandkits();
  }, [sortBy, sortOrder]);

  const fetchBrandkits = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/brandkits?${params}`);
      const data = await response.json();

      if (response.ok) {
        setBrandkits(data.brandkits || []);
        calculateStats(data.brandkits || []);
      } else {
        console.error("Failed to fetch brandkits:", data.error);
      }
    } catch (error) {
      console.error("Error fetching brandkits:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (brandkitList: Brandkit[]) => {
    const stats = {
      total: brandkitList.length,
      active: brandkitList.filter((b) => b.isActive).length,
      public: brandkitList.filter((b) => b.isPublic).length,
      private: brandkitList.filter((b) => !b.isPublic).length,
    };
    setStats(stats);
  };

  const handleDelete = async (brandkitId: string, brandkitName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${brandkitName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/brandkits/${brandkitId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBrandkits((prev) => prev.filter((b) => b.id !== brandkitId));
        alert("Brandkit deleted successfully");
      } else {
        const data = await response.json();
        alert(`Failed to delete brandkit: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting brandkit:", error);
      alert("Failed to delete brandkit");
    }
  };

  const handleDuplicate = async (brandkitId: string, brandkitName: string) => {
    try {
      const response = await fetch(`/api/brandkits/${brandkitId}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `${brandkitName} (Copy)` }),
      });

      if (response.ok) {
        fetchBrandkits(); // Refresh list
        alert("Brandkit duplicated successfully");
      } else {
        const data = await response.json();
        alert(`Failed to duplicate brandkit: ${data.error}`);
      }
    } catch (error) {
      console.error("Error duplicating brandkit:", error);
      alert("Failed to duplicate brandkit");
    }
  };

  const toggleStatus = async (brandkitId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/brandkits/${brandkitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setBrandkits((prev) =>
          prev.map((b) =>
            b.id === brandkitId ? { ...b, isActive: !currentStatus } : b
          )
        );
      } else {
        alert("Failed to update brandkit status");
      }
    } catch (error) {
      console.error("Error updating brandkit status:", error);
      alert("Failed to update brandkit status");
    }
  };

  const filteredBrandkits = brandkits.filter((brandkit) => {
    const matchesSearch =
      brandkit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brandkit.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && brandkit.isActive) ||
      (filterStatus === "inactive" && !brandkit.isActive);

    const matchesVisibility =
      filterVisibility === "all" ||
      (filterVisibility === "public" && brandkit.isPublic) ||
      (filterVisibility === "private" && !brandkit.isPublic);

    return matchesSearch && matchesStatus && matchesVisibility;
  });

  const ColorPalette = ({ colors }: { colors: any }) => (
    <div className="flex space-x-1">
      {colors.primary && (
        <div
          className="w-4 h-4 rounded-full border border-gray-200"
          style={{ backgroundColor: colors.primary[500] }}
          title="Primary"
        />
      )}
      {colors.secondary && (
        <div
          className="w-4 h-4 rounded-full border border-gray-200"
          style={{ backgroundColor: colors.secondary[500] }}
          title="Secondary"
        />
      )}
      {colors.accent && (
        <div
          className="w-4 h-4 rounded-full border border-gray-200"
          style={{ backgroundColor: colors.accent[500] }}
          title="Accent"
        />
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Brandkits</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your brand design systems and color palettes
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/brandkits/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Brandkit
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <SwatchIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Brandkits
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.active}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <EyeIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Public</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.public}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <XCircleIcon className="h-8 w-8 text-gray-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Private</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.private}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search brandkits..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visibility
              </label>
              <select
                value={filterVisibility}
                onChange={(e) => setFilterVisibility(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Name</option>
                <option value="createdAt">Created Date</option>
                <option value="usageCount">Usage Count</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Brandkits List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            All Brandkits ({filteredBrandkits.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredBrandkits.length === 0 ? (
            <div className="text-center py-12">
              <SwatchIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No brandkits found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first brandkit.
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/brandkits/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Brandkit
                </Link>
              </div>
            </div>
          ) : (
            filteredBrandkits.map((brandkit) => (
              <div key={brandkit.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="flex-shrink-0">
                      <ColorPalette colors={brandkit.colors} />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">
                          {brandkit.name}
                        </h3>
                        {brandkit.isDefault && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Default
                          </span>
                        )}
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            brandkit.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {brandkit.isActive ? "Active" : "Inactive"}
                        </span>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            brandkit.isPublic
                              ? "bg-purple-100 text-purple-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {brandkit.isPublic ? "Public" : "Private"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {brandkit.description || "No description"}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
                        <span>Used in {brandkit.usageCount} pages</span>
                        <span>By {brandkit.author?.name || "Unknown"}</span>
                        <span>
                          Created{" "}
                          {new Date(brandkit.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={`/admin/brandkits/${brandkit.id}/preview`}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Preview"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/brandkits/${brandkit.id}`}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() =>
                        handleDuplicate(brandkit.id, brandkit.name)
                      }
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Duplicate"
                    >
                      <DocumentDuplicateIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        toggleStatus(brandkit.id, brandkit.isActive)
                      }
                      className={`p-2 ${
                        brandkit.isActive
                          ? "text-green-400 hover:text-green-600"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                      title={brandkit.isActive ? "Deactivate" : "Activate"}
                    >
                      {brandkit.isActive ? (
                        <CheckCircleIcon className="h-4 w-4" />
                      ) : (
                        <XCircleIcon className="h-4 w-4" />
                      )}
                    </button>
                    {!brandkit.isDefault && (
                      <button
                        onClick={() => handleDelete(brandkit.id, brandkit.name)}
                        className="p-2 text-red-400 hover:text-red-600"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
