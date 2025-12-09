/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Palette, Plus, CheckCircle, AlertTriangle } from "lucide-react";
import { Brandkit } from "@/types/brandkit";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

interface TemplateBrandkitSelectorProps {
  onCreatePage: (data: {
    templateId: string;
    brandkitId: string;
    pageData: {
      slug: string;
      title: string;
      languageId: string;
      content?: string;
    };
  }) => void;
  className?: string;
}

export function TemplateBrandkitSelector({
  onCreatePage,
  className = "",
}: TemplateBrandkitSelectorProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [brandkits, setBrandkits] = useState<Brandkit[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedBrandkitId, setSelectedBrandkitId] = useState("");
  const [pageData, setPageData] = useState({
    slug: "",
    title: "",
    languageId: "en",
    content: "",
  });
  const [validation, setValidation] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Load templates and brandkits
  useEffect(() => {
    const loadData = async () => {
      try {
        const [templatesRes, brandkitsRes] = await Promise.all([
          fetch("/api/templates"),
          fetch("/api/brandkits"),
        ]);

        if (templatesRes.ok) {
          const templatesData = await templatesRes.json();
          setTemplates(templatesData.templates || []);
        }

        if (brandkitsRes.ok) {
          const brandkitsData = await brandkitsRes.json();
          setBrandkits(brandkitsData.brandkits || []);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, []);

  const handleCreatePage = async () => {
    if (
      !selectedTemplateId ||
      !selectedBrandkitId ||
      !pageData.slug ||
      !pageData.title
    ) {
      return;
    }

    setIsCreating(true);
    try {
      onCreatePage({
        templateId: selectedTemplateId,
        brandkitId: selectedBrandkitId,
        pageData,
      });
    } catch (error) {
      console.error("Failed to create page:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
  const selectedBrandkit = brandkits.find((b) => b.id === selectedBrandkitId);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Page from Template
          </CardTitle>
          <CardDescription>
            Select a template and brandkit to create a new page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-3">
            <Label>Template</Label>
            <Select
              value={selectedTemplateId}
              onValueChange={setSelectedTemplateId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      <Copy className="h-3 w-3" />
                      <span>{template.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTemplate && (
              <Card className="p-3">
                <div className="flex items-start gap-3">
                  {selectedTemplate.previewImage && (
                    <Image
                      src={getImageUrl(selectedTemplate.previewImage)}
                      alt={selectedTemplate.name}
                      className="w-16 h-16 rounded object-cover"
                      width={64}
                      height={64}
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{selectedTemplate.name}</h4>
                    {selectedTemplate.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedTemplate.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">
                        {selectedTemplate.category}
                      </Badge>
                      <Badge variant="outline">
                        {selectedTemplate.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Brandkit Selection */}
          <div className="space-y-3">
            <Label>Brandkit</Label>
            <Select
              value={selectedBrandkitId}
              onValueChange={setSelectedBrandkitId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a brandkit..." />
              </SelectTrigger>
              <SelectContent>
                {brandkits.map((brandkit) => (
                  <SelectItem key={brandkit.id} value={brandkit.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{
                          backgroundColor: brandkit.colors.primary[500],
                        }}
                      />
                      <span>{brandkit.name}</span>
                      {brandkit.isDefault && (
                        <Badge variant="outline" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedBrandkit && (
              <Card className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{selectedBrandkit.name}</h4>
                    <Palette className="h-4 w-4 text-gray-500" />
                  </div>

                  {selectedBrandkit.description && (
                    <p className="text-sm text-gray-600">
                      {selectedBrandkit.description}
                    </p>
                  )}

                  <div className="flex gap-1">
                    {Object.entries(selectedBrandkit.colors.primary)
                      .slice(0, 5)
                      .map(([shade, color]) => (
                        <div
                          key={shade}
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color }}
                          title={`Primary ${shade}`}
                        />
                      ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Page Details */}
          <div className="space-y-4">
            <Label>Page Details</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={pageData.title}
                  onChange={(e) =>
                    setPageData({ ...pageData, title: e.target.value })
                  }
                  placeholder="Enter page title..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={pageData.slug}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-"),
                    })
                  }
                  placeholder="page-url-slug"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={pageData.languageId}
                onValueChange={(value) =>
                  setPageData({ ...pageData, languageId: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="id">Indonesian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Initial Content (Optional)</Label>
              <textarea
                id="content"
                value={pageData.content}
                onChange={(e) =>
                  setPageData({ ...pageData, content: e.target.value })
                }
                placeholder="Enter initial page content..."
                className="mt-1 w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none"
              />
            </div>
          </div>

          {/* Validation Results */}
          {validation && (
            <Alert
              className={
                validation.compatible
                  ? "border-green-200 bg-green-50"
                  : "border-yellow-200 bg-yellow-50"
              }
            >
              <div className="flex items-start gap-2">
                {validation.compatible ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                )}
                <AlertDescription>
                  {validation.compatible ? (
                    <span className="text-green-800">
                      Template and brandkit are compatible
                    </span>
                  ) : (
                    <div className="text-yellow-800">
                      <p className="font-medium">
                        Compatibility issues detected
                      </p>
                      <ul className="list-disc list-inside mt-1 text-sm">
                        {validation.issues.map(
                          (issue: string, index: number) => (
                            <li key={index}>{issue}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Create Button */}
          <Button
            onClick={handleCreatePage}
            disabled={
              !selectedTemplateId ||
              !selectedBrandkitId ||
              !pageData.slug ||
              !pageData.title ||
              isCreating
            }
            className="w-full"
            size="lg"
          >
            {isCreating ? (
              <>
                <Copy className="h-4 w-4 mr-2 animate-spin" />
                Creating Page...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Page
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
