// src/app/admin/brandkits/[id]/preview/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Brandkit } from "@/types/brandkit";
import BrandkitPreview from "@/components/admin/Brandkit/BrandkitPreview";

export default function BrandkitPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const brandkitId = params.id as string;

  const [brandkit, setBrandkit] = useState<Brandkit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (brandkitId) {
      fetchBrandkit();
    }
  }, [brandkitId]);

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
            don&apos;t have access to it.
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
                Preview: {brandkit.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Full preview of your brandkit design system
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={`/admin/brandkits/${brandkitId}`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Brandkit
            </Link>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <BrandkitPreview brandkit={brandkit} />
    </div>
  );
}
