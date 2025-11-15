"use client";

import { useState, useEffect } from "react";
import { SimplePageEditor } from "@/components/admin/SimplePageEditor";

interface EditPageProps {
  params: {
    id: string;
  };
}

export default function EditPagePage({ params }: EditPageProps) {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(
          `/api/admin/pages/${params.id}?languageId=en`
        );
        if (response.ok) {
          const data = await response.json();
          setPageData(data);
        }
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [params.id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading page...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Page not found</p>
      </div>
    );
  }

  return <SimplePageEditor pageId={params.id} initialData={pageData} />;
}
