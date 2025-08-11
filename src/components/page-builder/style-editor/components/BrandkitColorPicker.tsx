"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Plus, Eye, Copy } from "lucide-react";
import { Brandkit, ColorPalette } from "@/types/brandkit";
import { StyleSettings } from "@/types/page-builder";

interface BrandkitColorPickerProps {
  brandkit: Brandkit;
  currentStyles: StyleSettings;
  onColorChange: (colors: Partial<StyleSettings>) => void;
}

export function BrandkitColorPicker({
  brandkit,
  currentStyles,
  onColorChange,
}: BrandkitColorPickerProps) {
  const [activeColorType, setActiveColorType] = useState<
    "primary" | "secondary" | "neutral" | "semantic"
  >("primary");
  const [customColor, setCustomColor] = useState("#000000");

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
      case "border":
        onColorChange({
          border: {
            ...currentStyles.border,
            color,
          },
        });
        break;
    }
  };

  const ColorSwatch = ({
    color,
    label,
    onClick,
  }: {
    color: string;
    label: string;
    onClick: () => void;
  }) => (
    <div className="group cursor-pointer" onClick={onClick}>
      <div
        className="w-8 h-8 rounded-md border border-gray-200 group-hover:scale-110 transition-transform"
        style={{ backgroundColor: color }}
        title={`${label}: ${color}`}
      />
      <div className="text-xs text-center mt-1 text-gray-600 group-hover:text-gray-900">
        {label}
      </div>
    </div>
  );

  const ColorPaletteDisplay = ({
    palette,
    name,
  }: {
    palette: ColorPalette;
    name: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Palette className="h-3 w-3" />
        <span className="text-sm font-medium capitalize">{name}</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(palette).map(([shade, color]) => (
          <div key={shade} className="space-y-1">
            <ColorSwatch
              color={color}
              label={shade}
              onClick={() => applyColor(color, "text")}
            />
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => applyColor(color, "background")}
                title="Apply as background"
              >
                <div className="w-2 h-2 bg-gray-400 rounded" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => applyColor(color, "border")}
                title="Apply as border"
              >
                <div className="w-2 h-2 border border-gray-400 rounded" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Tabs
        value={activeColorType}
        onValueChange={(value: any) => setActiveColorType(value)}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="primary">Primary</TabsTrigger>
          <TabsTrigger value="secondary">Secondary</TabsTrigger>
          <TabsTrigger value="neutral">Neutral</TabsTrigger>
          <TabsTrigger value="semantic">Semantic</TabsTrigger>
        </TabsList>

        <TabsContent value="primary" className="mt-4">
          <ColorPaletteDisplay
            palette={brandkit.colors.primary}
            name="primary"
          />
        </TabsContent>

        <TabsContent value="secondary" className="mt-4">
          <ColorPaletteDisplay
            palette={brandkit.colors.secondary}
            name="secondary"
          />
        </TabsContent>

        <TabsContent value="neutral" className="mt-4">
          <ColorPaletteDisplay
            palette={brandkit.colors.neutral}
            name="neutral"
          />
        </TabsContent>

        <TabsContent value="semantic" className="mt-4 space-y-4">
          <ColorPaletteDisplay
            palette={brandkit.colors.success}
            name="success"
          />
          <ColorPaletteDisplay
            palette={brandkit.colors.warning}
            name="warning"
          />
          <ColorPaletteDisplay palette={brandkit.colors.error} name="error" />
          <ColorPaletteDisplay palette={brandkit.colors.info} name="info" />
        </TabsContent>
      </Tabs>

      {/* Quick access to common colors */}
      <Card className="p-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="h-3 w-3" />
            <span className="text-sm font-medium">Quick Colors</span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {Object.entries(brandkit.colors.text).map(([name, color]) => (
              <ColorSwatch
                key={name}
                color={color}
                label={name}
                onClick={() => applyColor(color, "text")}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Custom color input */}
      <Card className="p-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Plus className="h-3 w-3" />
            <span className="text-sm font-medium">Custom Color</span>
          </div>
          <div className="flex gap-2">
            <Input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="h-8 w-16"
            />
            <Input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="h-8 flex-1"
              placeholder="#000000"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyColor(customColor, "text")}
              className="h-8"
            >
              Apply
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
