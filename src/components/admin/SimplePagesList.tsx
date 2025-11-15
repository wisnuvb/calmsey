"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  ExternalLink,
} from "lucide-react";

interface SimplePage {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export function SimplePagesList() {
  const router = useRouter();
  const [pages, setPages] = useState<SimplePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/admin/pages");
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm("Are you sure you want to delete this page?")) {
      return;
    }

    setDeleting(pageId);
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPages(pages.filter((page) => page.id !== pageId));
      } else {
        alert("Failed to delete page");
      }
    } catch (error) {
      console.error("Error deleting page:", error);
      alert("Failed to delete page");
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (pageId: string) => {
    router.push(`/admin/pages/edit/${pageId}`);
  };

  const handleView = (slug: string) => {
    window.open(`/${slug}`, "_blank");
  };

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Pages</h1>
        <Button
          onClick={() => router.push("/admin/pages/new")}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Page
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredPages.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "No pages found matching your search."
                  : "No pages created yet."}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => router.push("/admin/pages/new")}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Page
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredPages.map((page) => (
            <Card key={page.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{page.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <ExternalLink className="w-4 h-4" />/{page.slug}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {page.excerpt && (
                      <p className="text-gray-600 mt-2 line-clamp-2">
                        {page.excerpt}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary">Published</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(page.slug)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(page.id)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(page.id)}
                    disabled={deleting === page.id}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleting === page.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
