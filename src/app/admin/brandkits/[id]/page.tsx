// src/app/admin/brandkits/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, CheckIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Brandkit } from "@/types/brandkit";
import BrandkitEditor from "@/components/admin/Brandkit/BrandkitEditor";
import BrandkitPreview from "@/components/admin/Brandkit/BrandkitPreview";

export default function BrandkitEditPage() {
  const router = useRouter();
  const params = useParams();
  const brandkitId = params.id as string;

  const [brandkit, setBrandkit] = useState<Brandkit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (brandkitId && brandkitId !== "new") {
      fetchBrandkit();
    } else {
      // This shouldn't happen as "new" should be handled by /new/page.tsx
      router.push("/admin/brandkits/new");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandkitId, router]);

  const fetchBrandkit = async () => {
    try {
      const response = await fetch(`/api/brandkits/${brandkitId}`);
      if (response.ok) {
        const data = await response.json();
        setBrandkit(data.brandkit);
      } else {
        console.error("Failed to fetch brandkit");
        router.push("/admin/brandkits");
      }
    } catch (error) {
      console.error("Error fetching brandkit:", error);
      router.push("/admin/brandkits");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!brandkit) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/brandkits/${brandkitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brandkit.name,
          description: brandkit.description,
          colors: brandkit.colors,
          typography: brandkit.typography,
          spacing: brandkit.spacing,
          assets: brandkit.assets,
          isActive: brandkit.isActive,
          isPublic: brandkit.isPublic,
          isDefault: brandkit.isDefault,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBrandkit(data.brandkit);
        setHasChanges(false);
        alert("Brandkit saved successfully!");
      } else {
        const data = await response.json();
        alert(`Failed to save brandkit: ${data.error}`);
      }
    } catch (error) {
      console.error("Error saving brandkit:", error);
      alert("Failed to save brandkit");
    } finally {
      setSaving(false);
    }
  };

  const handleBrandkitChange = (updatedBrandkit: Brandkit) => {
    setBrandkit(updatedBrandkit);
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!brandkit) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            Brandkit not found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            The brandkit you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it. access to it.
          </p>
          <div className="mt-6">
            <Link
              href="/admin/brandkits"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Brandkits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/admin/brandkits"
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Edit: {brandkit.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Modify your brand design system and colors
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={`/admin/brandkits/${brandkitId}/preview`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              Preview
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Brandkit"}
            </button>
          </div>
        </div>

        {/* Unsaved Changes Warning */}
        {hasChanges && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
              You have unsaved changes. Don&apos;t forget to save your brandkit.
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("edit")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "edit"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Edit Brandkit
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "preview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Preview
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === "edit" ? (
        <BrandkitEditor
          brandkit={brandkit}
          onChange={handleBrandkitChange}
          onSave={handleSave}
          saving={saving}
        />
      ) : (
        <BrandkitPreview brandkit={brandkit} />
      )}
    </div>
  );
}
