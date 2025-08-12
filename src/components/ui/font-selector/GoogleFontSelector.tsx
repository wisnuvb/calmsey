/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ui/font-selector/GoogleFontSelector.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Type,
  Download,
  Check,
  Loader2,
  Eye,
  Star,
  Filter,
} from "lucide-react";
import {
  GoogleFont,
  GoogleFontCategory,
  GoogleFontsService,
} from "@/lib/fonts/google-fonts";
import { useGoogleFonts } from "@/hooks/useGoogleFonts";

interface GoogleFontSelectorProps {
  selectedFont?: string;
  selectedWeights?: string[];
  selectedStyles?: string[];
  onFontSelect: (font: {
    family: string;
    weights: string[];
    styles: string[];
  }) => void;
  showPreview?: boolean;
  previewText?: string;
  className?: string;
}

export function GoogleFontSelector({
  selectedFont,
  selectedWeights = ["400"],
  selectedStyles = ["normal"],
  onFontSelect,
  showPreview = true,
  previewText = "The quick brown fox jumps over the lazy dog",
  className = "",
}: GoogleFontSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    GoogleFontCategory | "all"
  >("all");
  const [activeTab, setActiveTab] = useState("browse");
  const [loadingFonts, setLoadingFonts] = useState<Set<string>>(new Set());
  const [customPreviewText, setCustomPreviewText] = useState(previewText);

  const {
    fonts,
    isLoading,
    error,
    loadFont,
    isFontLoaded,
    getFontsByCategory,
    commonWeights,
    commonStyles,
  } = useGoogleFonts({ limit: 100 });

  // Filter fonts based on search and category
  const filteredFonts = useMemo(() => {
    let filtered = fonts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((font) => font.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((font) =>
        font.family.toLowerCase().includes(query)
      );
    }

    return filtered.slice(0, 50); // Limit results for performance
  }, [fonts, selectedCategory, searchQuery]);

  // Load font preview
  const handleFontPreview = async (fontFamily: string) => {
    if (isFontLoaded(fontFamily) || loadingFonts.has(fontFamily)) return;

    setLoadingFonts((prev) => new Set([...prev, fontFamily]));

    try {
      await loadFont(fontFamily, ["400"], ["normal"]);
    } catch (error) {
      console.error("Failed to load font preview:", error);
    } finally {
      setLoadingFonts((prev) => {
        const next = new Set(prev);
        next.delete(fontFamily);
        return next;
      });
    }
  };

  // Handle font selection
  const handleFontSelect = (font: GoogleFont) => {
    onFontSelect({
      family: font.family,
      weights: selectedWeights,
      styles: selectedStyles,
    });

    // Load the font with selected weights
    loadFont(font.family, selectedWeights, selectedStyles);
  };

  // Update weights
  const handleWeightChange = (weights: string[]) => {
    if (selectedFont) {
      onFontSelect({
        family: selectedFont,
        weights,
        styles: selectedStyles,
      });
    }
  };

  // Update styles
  const handleStyleChange = (styles: string[]) => {
    if (selectedFont) {
      onFontSelect({
        family: selectedFont,
        weights: selectedWeights,
        styles,
      });
    }
  };

  const FontCard = ({ font }: { font: GoogleFont }) => {
    const isSelected = selectedFont === font.family;
    const isLoaded = isFontLoaded(font.family);
    const isLoadingFont = loadingFonts.has(font.family);

    return (
      <Card
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
        }`}
        onClick={() => handleFontSelect(font)}
        onMouseEnter={() => handleFontPreview(font.family)}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Font Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{font.family}</h4>
                {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                {isLoadingFont && (
                  <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">
                  {font.category}
                </Badge>
                {font.popularity <= 10 && (
                  <Star className="h-3 w-3 text-yellow-500" />
                )}
              </div>
            </div>

            {/* Font Preview */}
            {showPreview && (
              <div
                className="text-lg leading-relaxed transition-all"
                style={{
                  fontFamily: isLoaded ? font.family : "system-ui",
                  opacity: isLoaded ? 1 : 0.7,
                }}
              >
                {customPreviewText}
              </div>
            )}

            {/* Font Info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{font.variants.length} weights</span>
              <span>#{font.popularity}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Fonts</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-4">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search fonts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={(value: any) => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-48">
                  <Filter className="h-3 w-3 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sans-serif">Sans Serif</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="display">Display</SelectItem>
                  <SelectItem value="handwriting">Handwriting</SelectItem>
                  <SelectItem value="monospace">Monospace</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preview Text Input */}
            {showPreview && (
              <div>
                <Label className="text-sm">Preview Text</Label>
                <Input
                  value={customPreviewText}
                  onChange={(e) => setCustomPreviewText(e.target.value)}
                  placeholder="Enter custom preview text..."
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading fonts...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <Button variant="outline" size="sm" className="mt-2">
                Retry
              </Button>
            </div>
          )}

          {/* Font Grid */}
          {!isLoading && !error && (
            <ScrollArea className="h-[500px]">
              <div className="grid gap-4">
                {filteredFonts.map((font) => (
                  <FontCard key={font.family} font={font} />
                ))}
              </div>

              {filteredFonts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No fonts found</p>
                  <p className="text-sm">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </ScrollArea>
          )}
        </TabsContent>

        {/* Customize Tab */}
        <TabsContent value="customize" className="space-y-4">
          {selectedFont ? (
            <div className="space-y-6">
              {/* Selected Font Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedFont}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview */}
                  <div
                    className="text-2xl font-medium p-4 border rounded bg-gray-50"
                    style={{ fontFamily: selectedFont }}
                  >
                    {customPreviewText}
                  </div>

                  {/* Font Weights */}
                  <div>
                    <Label className="text-sm font-medium">Font Weights</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {commonWeights.map((weight) => (
                        <label
                          key={weight.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedWeights.includes(weight.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleWeightChange([
                                  ...selectedWeights,
                                  weight.value,
                                ]);
                              } else {
                                handleWeightChange(
                                  selectedWeights.filter(
                                    (w) => w !== weight.value
                                  )
                                );
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{weight.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Font Styles */}
                  <div>
                    <Label className="text-sm font-medium">Font Styles</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {commonStyles.map((style) => (
                        <label
                          key={style.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStyles.includes(style.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleStyleChange([
                                  ...selectedStyles,
                                  style.value,
                                ]);
                              } else {
                                handleStyleChange(
                                  selectedStyles.filter(
                                    (s) => s !== style.value
                                  )
                                );
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{style.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Preview Sizes */}
                  <div>
                    <Label className="text-sm font-medium">Preview Sizes</Label>
                    <div className="space-y-3 mt-2">
                      {[
                        { size: "text-sm", label: "Small (14px)" },
                        { size: "text-base", label: "Base (16px)" },
                        { size: "text-lg", label: "Large (18px)" },
                        { size: "text-xl", label: "Extra Large (20px)" },
                        { size: "text-2xl", label: "Heading (24px)" },
                      ].map(({ size, label }) => (
                        <div
                          key={size}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <span className="text-xs text-gray-500">{label}</span>
                          <div
                            className={`${size} font-medium`}
                            style={{ fontFamily: selectedFont }}
                          >
                            {customPreviewText}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Download font CSS - Generate CSS manually since method doesn't exist
                        const fontUrl = GoogleFontsService.generateFontUrl(
                          selectedFont,
                          selectedWeights,
                          selectedStyles
                        );
                        const css = `@import url('${fontUrl}');\n\n/* Font Family Variable */\n:root {\n  --font-${selectedFont
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )}: '${selectedFont}', system-ui, sans-serif;\n}`;

                        const blob = new Blob([css], { type: "text/css" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${selectedFont
                          .toLowerCase()
                          .replace(/\s+/g, "-")}.css`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download CSS
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Preview in new tab
                        const html = `
                          <!DOCTYPE html>
                          <html>
                          <head>
                            <title>${selectedFont} Preview</title>
                            <link href="${GoogleFontsService.generateFontUrl(
                              selectedFont,
                              selectedWeights,
                              selectedStyles
                            )}" rel="stylesheet">
                            <style>
                              body { font-family: '${selectedFont}', sans-serif; margin: 2rem; line-height: 1.6; }
                              .preview { margin: 2rem 0; }
                            </style>
                          </head>
                          <body>
                            <h1>${selectedFont}</h1>
                            <div class="preview">
                              <h2>The quick brown fox jumps over the lazy dog</h2>
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                              <p><strong>Bold text</strong> and <em>italic text</em> examples.</p>
                            </div>
                          </body>
                          </html>
                        `;

                        const blob = new Blob([html], { type: "text/html" });
                        const url = URL.createObjectURL(blob);
                        window.open(url, "_blank");
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No font selected</p>
              <p className="text-sm">
                Select a font from the Browse tab to customize it
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
