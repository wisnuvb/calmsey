"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, ArrowLeft, Eye } from "lucide-react";

interface SimplePageEditorProps {
  pageId?: string;
  initialData?: {
    slug: string;
    title: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
  };
}

export function SimplePageEditor({
  pageId,
  initialData,
}: SimplePageEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    featuredImage: initialData?.featuredImage || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = pageId ? `/api/admin/pages/${pageId}` : "/api/admin/pages";

      const method = pageId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          languageId: "en", // Default to English
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save page");
      }

      await response.json();
      router.push("/admin/pages");
    } catch (error) {
      console.error("Error saving page:", error);
      alert("Failed to save page. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    const previewUrl = `/preview/${formData.slug}`;
    window.open(previewUrl, "_blank");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {pageId ? "Edit Page" : "Create New Page"}
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={handlePreview}
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Preview
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="page-slug"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL: /{formData.slug}
                </p>
              </div>
              <div>
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage}
                  onChange={(e) =>
                    setFormData({ ...formData, featuredImage: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Page title"
                required
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt (Optional)</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Brief description of the page"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="content">Page Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Write your page content here..."
                rows={20}
                required
                className="font-mono"
              />
              <p className="text-sm text-gray-500 mt-1">
                You can use HTML tags for formatting
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Page"}
          </Button>
        </div>
      </form>
    </div>
  );
}
