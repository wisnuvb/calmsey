/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/page-builder/PageBrandkitManager.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  Wand2,
  Eye,
  CheckCircle,
  AlertTriangle,
  X,
  RefreshCw,
} from "lucide-react";
import { Brandkit } from "@/types/brandkit";
import { PageSection } from "@/types/page-builder";
import { BrandkitApplicationResult } from "@/lib/page-builder/page-brandkit-integration";

interface PageBrandkitManagerProps {
  pageId: string;
  sections: PageSection[];
  currentBrandkit?: Brandkit | null;
  onBrandkitApplied?: (result: BrandkitApplicationResult) => void;
  className?: string;
}

export function PageBrandkitManager({
  pageId,
  sections,
  currentBrandkit,
  onBrandkitApplied,
  className = "",
}: PageBrandkitManagerProps) {
  const [availableBrandkits, setAvailableBrandkits] = useState<Brandkit[]>([]);
  const [selectedBrandkitId, setSelectedBrandkitId] = useState<string>("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [lastResult, setLastResult] =
    useState<BrandkitApplicationResult | null>(null);
  const [validation, setValidation] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [applicationOptions, setApplicationOptions] = useState({
    preserveCustomizations: true,
    applyColors: true,
    applyTypography: true,
    applySpacing: true,
    applyResponsive: true,
    conflictResolution: "merge" as "overwrite" | "merge" | "skip",
  });

  // Load available brandkits
  useEffect(() => {
    const loadBrandkits = async () => {
      try {
        const response = await fetch("/api/brandkits");
        if (response.ok) {
          const data = await response.json();
          setAvailableBrandkits(data.brandkits || []);
        }
      } catch (error) {
        console.error("Failed to load brandkits:", error);
      }
    };

    loadBrandkits();
  }, []);

  // Set current brandkit as selected
  useEffect(() => {
    if (currentBrandkit) {
      setSelectedBrandkitId(currentBrandkit.id);
    }
  }, [currentBrandkit]);

  // Validate compatibility when brandkit changes
  useEffect(() => {
    if (selectedBrandkitId && selectedBrandkitId !== currentBrandkit?.id) {
      validateCompatibility();
    }
  }, [selectedBrandkitId]);

  const validateCompatibility = async () => {
    if (!selectedBrandkitId) return;

    try {
      const response = await fetch(`/api/pages/${pageId}/brandkit/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandkitId: selectedBrandkitId }),
      });

      if (response.ok) {
        const validation = await response.json();
        setValidation(validation);
      }
    } catch (error) {
      console.error("Failed to validate compatibility:", error);
    }
  };

  const handleApplyBrandkit = async (dryRun = false) => {
    if (!selectedBrandkitId) return;

    setIsApplying(true);
    try {
      const payload = {
        brandkitId: selectedBrandkitId,
        sectionIds: selectedSections.length > 0 ? selectedSections : undefined,
        options: applicationOptions,
        dryRun,
      };

      const response = await fetch(`/api/pages/${pageId}/brandkit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        setLastResult(result);

        if (!dryRun) {
          onBrandkitApplied?.(result);
        }
      } else {
        const error = await response.json();
        console.error("Failed to apply brandkit:", error);
      }
    } catch (error) {
      console.error("Failed to apply brandkit:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveBrandkit = async () => {
    try {
      const response = await fetch(`/api/pages/${pageId}/brandkit`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSelectedBrandkitId("");
        setLastResult(null);
        onBrandkitApplied?.({
          success: true,
          pageId,
          brandkitId: "",
          appliedSections: 0,
          skippedSections: 0,
          errors: [],
          changes: {},
        });
      }
    } catch (error) {
      console.error("Failed to remove brandkit:", error);
    }
  };

  const selectedBrandkit = availableBrandkits.find(
    (b) => b.id === selectedBrandkitId
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Page Brandkit Manager
              </CardTitle>
              <CardDescription>
                Apply and manage brandkit for this page
              </CardDescription>
            </div>
            {currentBrandkit && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {currentBrandkit.name}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="apply" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="apply">Apply Brandkit</TabsTrigger>
          <TabsTrigger value="sections">Section Selection</TabsTrigger>
          <TabsTrigger value="options">Advanced Options</TabsTrigger>
        </TabsList>

        {/* Apply Brandkit Tab */}
        <TabsContent value="apply" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Brandkit</CardTitle>
              <CardDescription>
                Choose a brandkit to apply to this page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Brandkit Selector */}
              <div>
                <Select
                  value={selectedBrandkitId}
                  onValueChange={setSelectedBrandkitId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brandkit..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBrandkits.map((brandkit) => (
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
              </div>

              {/* Brandkit Preview */}
              {selectedBrandkit && (
                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{selectedBrandkit.name}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewMode(!previewMode)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        {previewMode ? "Hide" : "Preview"}
                      </Button>
                    </div>

                    {selectedBrandkit.description && (
                      <p className="text-sm text-gray-600">
                        {selectedBrandkit.description}
                      </p>
                    )}

                    {/* Color Preview */}
                    <div>
                      <span className="text-sm font-medium">Colors:</span>
                      <div className="flex gap-1 mt-1">
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

                    {/* Typography Preview */}
                    <div>
                      <span className="text-sm font-medium">Typography:</span>
                      <div className="text-sm text-gray-600">
                        Primary:{" "}
                        {selectedBrandkit.typography.fontFamilies.heading.name}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Compatibility Validation */}
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
                    <div className="flex-1">
                      <AlertDescription>
                        {validation.compatible ? (
                          <span className="text-green-800">
                            Brandkit is fully compatible with this page
                          </span>
                        ) : (
                          <div className="text-yellow-800">
                            <p className="font-medium mb-2">
                              Compatibility Issues:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {validation.issues.map(
                                (issue: string, index: number) => (
                                  <li key={index}>{issue}</li>
                                )
                              )}
                            </ul>
                            {validation.suggestions.length > 0 && (
                              <div className="mt-2">
                                <p className="font-medium">Suggestions:</p>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {validation.suggestions.map(
                                    (suggestion: string, index: number) => (
                                      <li key={index}>{suggestion}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApplyBrandkit(true)}
                  disabled={!selectedBrandkitId || isApplying}
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Changes
                </Button>
                <Button
                  onClick={() => handleApplyBrandkit(false)}
                  disabled={!selectedBrandkitId || isApplying}
                  className="flex-1"
                >
                  {isApplying ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Apply Brandkit
                </Button>
              </div>

              {/* Remove Current Brandkit */}
              {currentBrandkit && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Current Brandkit</p>
                      <p className="text-sm text-gray-600">
                        {currentBrandkit.name}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveBrandkit}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Application Result */}
          {lastResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {lastResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  Application Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">
                      Applied Sections:
                    </span>
                    <div className="text-2xl font-bold text-green-600">
                      {lastResult.appliedSections}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">
                      Skipped Sections:
                    </span>
                    <div className="text-2xl font-bold text-gray-500">
                      {lastResult.skippedSections}
                    </div>
                  </div>
                </div>

                {lastResult.errors.length > 0 && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription>
                      <p className="font-medium text-red-800 mb-2">Errors:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                        {lastResult.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {Object.keys(lastResult.changes).length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Changes Applied:</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {Object.entries(lastResult.changes).map(
                        ([sectionId, changes]) => (
                          <div
                            key={sectionId}
                            className="text-xs bg-gray-50 p-2 rounded"
                          >
                            <div className="font-medium">
                              Section {sectionId}:
                            </div>
                            <ul className="list-disc list-inside mt-1 text-gray-600">
                              {changes.map((change, index) => (
                                <li key={index}>{change}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Section Selection Tab */}
        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section Selection</CardTitle>
              <CardDescription>
                Choose which sections to apply the brandkit to. Leave empty to
                apply to all sections.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedSections(sections.map((s) => s.id))
                    }
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSections([])}
                  >
                    Clear All
                  </Button>
                  <span className="text-sm text-gray-600">
                    {selectedSections.length} of {sections.length} selected
                  </span>
                </div>

                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {sections.map((section, index) => (
                    <label
                      key={section.id}
                      className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSections.includes(section.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSections([
                              ...selectedSections,
                              section.id,
                            ]);
                          } else {
                            setSelectedSections(
                              selectedSections.filter((id) => id !== section.id)
                            );
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          Section {index + 1}: {section.type}
                        </div>
                        <div className="text-xs text-gray-500">
                          {section.translations.find(
                            (t) => t.languageId === "en"
                          )?.title || "Untitled"}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {section.type}
                      </Badge>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Options Tab */}
        <TabsContent value="options" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Options</CardTitle>
              <CardDescription>
                Configure how the brandkit should be applied
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* What to Apply */}
              <div>
                <h4 className="font-medium mb-3">What to Apply</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "applyColors", label: "Colors" },
                    { key: "applyTypography", label: "Typography" },
                    { key: "applySpacing", label: "Spacing" },
                    { key: "applyResponsive", label: "Responsive" },
                  ].map((option) => (
                    <label key={option.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          applicationOptions[
                            option.key as keyof typeof applicationOptions
                          ] as boolean
                        }
                        onChange={(e) =>
                          setApplicationOptions({
                            ...applicationOptions,
                            [option.key]: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Conflict Resolution */}
              <div>
                <h4 className="font-medium mb-3">Conflict Resolution</h4>
                <div className="space-y-2">
                  {[
                    {
                      value: "merge",
                      label: "Merge",
                      description:
                        "Preserve existing customizations where possible",
                    },
                    {
                      value: "overwrite",
                      label: "Overwrite",
                      description: "Replace all styles with brandkit values",
                    },
                    {
                      value: "skip",
                      label: "Skip",
                      description: "Skip sections with existing customizations",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-start gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="conflictResolution"
                        value={option.value}
                        checked={
                          applicationOptions.conflictResolution === option.value
                        }
                        onChange={(e) =>
                          setApplicationOptions({
                            ...applicationOptions,
                            conflictResolution: e.target.value as any,
                          })
                        }
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-sm">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-600">
                          {option.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Additional Options */}
              <div>
                <h4 className="font-medium mb-3">Additional Options</h4>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={applicationOptions.preserveCustomizations}
                    onChange={(e) =>
                      setApplicationOptions({
                        ...applicationOptions,
                        preserveCustomizations: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  <div>
                    <div className="text-sm font-medium">
                      Preserve Customizations
                    </div>
                    <div className="text-xs text-gray-600">
                      Keep existing custom styles when possible
                    </div>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
