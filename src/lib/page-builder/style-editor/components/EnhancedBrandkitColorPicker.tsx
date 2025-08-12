/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/page-builder/style-editor/components/EnhancedBrandkitColorPicker.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Palette,
  Plus,
  Eye,
  Copy,
  Wand2,
  CheckCircle,
  AlertTriangle,
  Settings,
  RefreshCw,
} from "lucide-react";
import { Brandkit, ColorPalette, BrandkitColors } from "@/types/brandkit";
import { StyleSettings } from "@/types/page-builder";

// Import our ColorGenerator for accessibility checking
import { ColorGenerator } from "@/lib/colors/color-generator";

interface EnhancedBrandkitColorPickerProps {
  brandkit: Brandkit;
  currentStyles: StyleSettings;
  onColorChange: (colors: Partial<StyleSettings>) => void;
  onBrandkitUpdate?: (updatedBrandkit: Partial<Brandkit>) => void;
  allowBrandkitEdit?: boolean;
}

export function EnhancedBrandkitColorPicker({
  brandkit,
  currentStyles,
  onColorChange,
  onBrandkitUpdate,
  allowBrandkitEdit = false,
}: EnhancedBrandkitColorPickerProps) {
  const [activeTab, setActiveTab] = useState<
    "brandkit" | "generator" | "custom"
  >("brandkit");
  const [customColor, setCustomColor] = useState("#000000");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [generatedPalette, setGeneratedPalette] = useState<ColorPalette | null>(
    null
  );

  const applyColor = (
    color: string,
    type: "text" | "background" | "border"
  ) => {
    switch (type) {
      case "text":
        onColorChange({ textColor: color });
        break;
      case "background":
        onColorChange({
          background: {
            ...currentStyles.background,
            type: "color",
            color,
          },
        });
        break;
      // case 'border':
      //   onColorChange({
      //     border: {
      //       ...currentStyles.border,
      //       color
      //     }
      //   });
      //   break;
    }
  };

  const handleGenerateFromColor = (baseColor: string) => {
    setIsGenerating(true);

    try {
      // Generate palette using our ColorGenerator
      const palette = ColorGenerator.generatePalette(baseColor);
      setGeneratedPalette(palette);

      // If brandkit update is allowed, generate complete brandkit colors
      if (onBrandkitUpdate && allowBrandkitEdit) {
        const brandkitColors = ColorGenerator.generateBrandkitColors(baseColor);
        onBrandkitUpdate({ colors: brandkitColors });
      }

      // Apply primary color to current element
      applyColor(baseColor, "text");
    } catch (error) {
      console.error("Failed to generate colors:", error);
    } finally {
      setTimeout(() => setIsGenerating(false), 1000);
    }
  };

  const copyColorToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
    } catch (error) {
      console.error("Failed to copy color:", error);
    }
  };

  const ColorSwatch = ({
    color,
    label,
    onClick,
    size = "normal",
    showInfo = false,
  }: {
    color: string;
    label: string;
    onClick: () => void;
    size?: "small" | "normal" | "large";
    showInfo?: boolean;
  }) => {
    const sizeClasses = {
      small: "w-6 h-6",
      normal: "w-8 h-8",
      large: "w-12 h-12",
    };

    // Get current background color for accessibility checking
    const backgroundColor = currentStyles.background?.color || "#ffffff";
    const accessibility = showAccessibility
      ? ColorGenerator.checkAccessibility(color, backgroundColor)
      : null;

    return (
      <div className="group cursor-pointer" onClick={onClick}>
        <div
          className={`${sizeClasses[size]} rounded-md border border-gray-200 group-hover:scale-110 transition-transform relative`}
          style={{ backgroundColor: color }}
          title={`${label}: ${color}`}
        >
          {/* Accessibility indicator */}
          {accessibility && (
            <div className="absolute -top-1 -right-1">
              {accessibility.wcagAA ? (
                <CheckCircle className="h-3 w-3 text-green-600 bg-white rounded-full" />
              ) : (
                <AlertTriangle className="h-3 w-3 text-red-600 bg-white rounded-full" />
              )}
            </div>
          )}
        </div>
        <div className="text-xs text-center mt-1 text-gray-600 group-hover:text-gray-900">
          {showInfo ? (
            <div>
              <div className="font-medium">{label}</div>
              <div className="font-mono text-xs">{color}</div>
              {accessibility && (
                <div className="text-xs">
                  {accessibility.contrastRatio.toFixed(1)}:1
                </div>
              )}
            </div>
          ) : (
            label
          )}
        </div>
      </div>
    );
  };

  const ColorPaletteDisplay = ({
    palette,
    name,
    type,
  }: {
    palette: ColorPalette;
    name: string;
    type: "text" | "background" | "border";
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4" />
        <span className="text-sm font-medium capitalize">{name}</span>
        <Badge variant="outline" className="text-xs">
          {type}
        </Badge>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {Object.entries(palette)
          .slice(0, 6)
          .map(([shade, color]) => (
            <div key={shade} className="space-y-1">
              <ColorSwatch
                color={color}
                label={shade}
                onClick={() => applyColor(color, type)}
                showInfo={showAccessibility}
              />
              <div className="flex gap-1 justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    applyColor(color, "background");
                  }}
                  title="Apply as background"
                >
                  <div className="w-2 h-2 bg-gray-400 rounded" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    applyColor(color, "border");
                  }}
                  title="Apply as border"
                >
                  <div className="w-2 h-2 border border-gray-400 rounded" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyColorToClipboard(color);
                  }}
                  title="Copy color"
                >
                  <Copy className="h-2 w-2" />
                </Button>
              </div>
            </div>
          ))}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(palette)
          .slice(6)
          .map(([shade, color]) => (
            <div key={shade} className="space-y-1">
              <ColorSwatch
                color={color}
                label={shade}
                onClick={() => applyColor(color, type)}
                showInfo={showAccessibility}
              />
              <div className="flex gap-1 justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    applyColor(color, "background");
                  }}
                  title="Apply as background"
                >
                  <div className="w-2 h-2 bg-gray-400 rounded" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    applyColor(color, "border");
                  }}
                  title="Apply as border"
                >
                  <div className="w-2 h-2 border border-gray-400 rounded" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyColorToClipboard(color);
                  }}
                  title="Copy color"
                >
                  <Copy className="h-2 w-2" />
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Enhanced Color Picker</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAccessibility(!showAccessibility)}
            className={showAccessibility ? "bg-blue-50 border-blue-200" : ""}
          >
            <Eye className="h-3 w-3 mr-1" />
            A11y
          </Button>
          {allowBrandkitEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("generator")}
            >
              <Settings className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Accessibility Alert */}
      {showAccessibility && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Accessibility mode enabled. Colors show WCAG compliance indicators.
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="brandkit">Brandkit</TabsTrigger>
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        {/* Brandkit Colors Tab */}
        <TabsContent value="brandkit" className="space-y-4">
          <div className="space-y-6">
            {/* Primary Colors */}
            <ColorPaletteDisplay
              palette={brandkit.colors.primary}
              name="Primary"
              type="text"
            />

            {/* Secondary Colors */}
            <ColorPaletteDisplay
              palette={brandkit.colors.secondary}
              name="Secondary"
              type="text"
            />

            {/* Neutral Colors */}
            <ColorPaletteDisplay
              palette={brandkit.colors.neutral}
              name="Neutral"
              type="text"
            />

            {/* Semantic Colors */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">
                Semantic Colors
              </h4>
              {/* <div className="grid grid-cols-2 gap-4">
                <ColorPaletteDisplay
                  palette={brandkit.colors.success}
                  name="Success"
                  type="text"
                />
                <ColorPaletteDisplay
                  palette={brandkit.colors.error}
                  name="Error"
                  type="text"
                />
                <ColorPaletteDisplay
                  palette={brandkit.colors.warning}
                  name="Warning"
                  type="text"
                />
                <ColorPaletteDisplay
                  palette={brandkit.colors.info}
                  name="Info"
                  type="text"
                />
              </div> */}
            </div>

            {/* Quick Text Colors */}
            <Card className="p-3">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-3 w-3" />
                  <span className="text-sm font-medium">Text Colors</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {/* {Object.entries(brandkit.colors.text).map(([name, color]) => (
                    <ColorSwatch
                      key={name}
                      color={color}
                      label={name}
                      onClick={() => applyColor(color, "text")}
                      showInfo={showAccessibility}
                    />
                  ))} */}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Color Generator Tab */}
        <TabsContent value="generator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Generate Color Palette</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Base Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="h-10 w-20"
                  />
                  <Input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="flex-1"
                    placeholder="#000000"
                  />
                  <Button
                    onClick={() => handleGenerateFromColor(customColor)}
                    disabled={isGenerating}
                    className="flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Wand2 className="h-3 w-3" />
                    )}
                    Generate
                  </Button>
                </div>
              </div>

              {/* Generated Palette Preview */}
              {generatedPalette && (
                <div className="space-y-3">
                  <Label>Generated Palette</Label>
                  <ColorPaletteDisplay
                    palette={generatedPalette}
                    name="Generated"
                    type="text"
                  />
                </div>
              )}

              {/* Color Harmony */}
              <div className="space-y-3">
                <Label>Color Harmony</Label>
                <div className="grid grid-cols-2 gap-4">
                  {ColorGenerator.isValidHexColor(customColor) &&
                    (() => {
                      const harmony =
                        ColorGenerator.generateColorHarmony(customColor);
                      return (
                        <>
                          <div className="space-y-2">
                            <span className="text-xs text-gray-600">
                              Complementary
                            </span>
                            <ColorSwatch
                              color={harmony.complementary}
                              label="Comp"
                              onClick={() =>
                                applyColor(harmony.complementary, "text")
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <span className="text-xs text-gray-600">
                              Analogous
                            </span>
                            <div className="flex gap-1">
                              {harmony.analogous.map((color, index) => (
                                <ColorSwatch
                                  key={index}
                                  color={color}
                                  label={`A${index + 1}`}
                                  onClick={() => applyColor(color, "text")}
                                  size="small"
                                />
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <span className="text-xs text-gray-600">
                              Triadic
                            </span>
                            <div className="flex gap-1">
                              {harmony.triadic.map((color, index) => (
                                <ColorSwatch
                                  key={index}
                                  color={color}
                                  label={`T${index + 1}`}
                                  onClick={() => applyColor(color, "text")}
                                  size="small"
                                />
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <span className="text-xs text-gray-600">
                              Split Complementary
                            </span>
                            <div className="flex gap-1">
                              {harmony.splitComplementary.map(
                                (color, index) => (
                                  <ColorSwatch
                                    key={index}
                                    color={color}
                                    label={`S${index + 1}`}
                                    onClick={() => applyColor(color, "text")}
                                    size="small"
                                  />
                                )
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                </div>
              </div>

              {/* Accessibility Suggestions */}
              {showAccessibility &&
                ColorGenerator.isValidHexColor(customColor) && (
                  <div className="space-y-3">
                    <Label>Accessibility Suggestions</Label>
                    <div className="space-y-2">
                      {(() => {
                        const backgroundColor =
                          currentStyles.background?.color || "#ffffff";
                        const suggestions =
                          ColorGenerator.generateAccessiblePairs(customColor);
                        return suggestions.slice(0, 3).map((pair, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-xs"
                          >
                            <ColorSwatch
                              color={pair.foreground}
                              label="FG"
                              onClick={() =>
                                applyColor(pair.foreground, "text")
                              }
                              size="small"
                            />
                            <span>on</span>
                            <ColorSwatch
                              color={pair.background}
                              label="BG"
                              onClick={() =>
                                applyColor(pair.background, "background")
                              }
                              size="small"
                            />
                            <Badge variant="outline" className="text-xs">
                              {pair.accessibility.contrastRatio.toFixed(1)}:1
                            </Badge>
                            <Badge
                              variant={
                                pair.accessibility.wcagAAA
                                  ? "default"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {pair.accessibility.wcagAAA ? "AAA" : "AA"}
                            </Badge>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Color Tab */}
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <Label>Custom Color Input</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="h-10 w-20"
                  />
                  <Input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="flex-1"
                    placeholder="#000000"
                  />
                </div>
              </div>

              {/* Apply buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyColor(customColor, "text")}
                  className="flex items-center gap-1"
                >
                  <span>Text</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyColor(customColor, "background")}
                  className="flex items-center gap-1"
                >
                  <span>Background</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyColor(customColor, "border")}
                  className="flex items-center gap-1"
                >
                  <span>Border</span>
                </Button>
              </div>

              {/* Color Utilities */}
              <div className="space-y-3">
                <Label>Color Utilities</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const lightened = ColorGenerator.lighten(customColor, 20);
                      setCustomColor(lightened);
                    }}
                  >
                    Lighten
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const darkened = ColorGenerator.darken(customColor, 20);
                      setCustomColor(darkened);
                    }}
                  >
                    Darken
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const saturated = ColorGenerator.adjustSaturation(
                        customColor,
                        20
                      );
                      setCustomColor(saturated);
                    }}
                  >
                    Saturate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const desaturated = ColorGenerator.adjustSaturation(
                        customColor,
                        -20
                      );
                      setCustomColor(desaturated);
                    }}
                  >
                    Desaturate
                  </Button>
                </div>
              </div>

              {/* Random Color */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const randomColor = ColorGenerator.getRandomColor();
                  setCustomColor(randomColor);
                }}
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Random Color
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
