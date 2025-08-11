"use client";

import React from "react";
import { Button } from "@/components/ui/button";
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
import { Type, Eye } from "lucide-react";
import { Brandkit, TextStyle } from "@/types/brandkit";
import { StyleSettings } from "@/types/page-builder";

interface BrandkitTypographySelectorProps {
  brandkit: Brandkit;
  currentStyles: StyleSettings;
  onTypographyChange: (typography: Partial<StyleSettings>) => void;
}

export function BrandkitTypographySelector({
  brandkit,
  currentStyles,
  onTypographyChange,
}: BrandkitTypographySelectorProps) {
  const applyTextStyle = (textStyle: TextStyle) => {
    onTypographyChange({
      typography: {
        ...currentStyles.typography,
        fontFamily: textStyle.fontFamily,
        fontSize: parseInt(textStyle.fontSize),
        fontWeight: textStyle.fontWeight,
        lineHeight: parseFloat(textStyle.lineHeight),
        letterSpacing: parseFloat(textStyle.letterSpacing) || 0,
        textTransform: textStyle.textTransform,
        textDecoration: textStyle.textDecoration,
      },
    });
  };

  const TextStylePreview = ({
    name,
    style,
  }: {
    name: string;
    style: TextStyle;
  }) => (
    <Card
      className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => applyTextStyle(style)}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium capitalize">{name}</span>
          <Badge variant="outline" className="text-xs">
            {style.fontSize} / {style.fontWeight}
          </Badge>
        </div>
        <div
          className="text-gray-900"
          style={{
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing,
            textTransform: style.textTransform,
            textDecoration: style.textDecoration,
          }}
        >
          {name === "h1"
            ? "Heading 1"
            : name === "h2"
            ? "Heading 2"
            : name === "h3"
            ? "Heading 3"
            : name === "body"
            ? "Body text example"
            : name === "caption"
            ? "Caption text"
            : `${name.charAt(0).toUpperCase() + name.slice(1)} text`}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Font Family Selection */}
      <Card className="p-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Type className="h-3 w-3" />
            <span className="text-sm font-medium">Font Families</span>
          </div>
          <div className="space-y-2">
            {Object.entries(brandkit.typography.fontFamilies).map(
              ([key, fontFamily]) => (
                <Button
                  key={key}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={() =>
                    onTypographyChange({
                      typography: {
                        ...currentStyles.typography,
                        fontFamily: fontFamily.name,
                      },
                    })
                  }
                >
                  <div className="text-left">
                    <div
                      className="font-medium"
                      style={{ fontFamily: fontFamily.name }}
                    >
                      {fontFamily.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {key}
                    </div>
                  </div>
                </Button>
              )
            )}
          </div>
        </div>
      </Card>

      {/* Text Style Presets */}
      <Card className="p-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="h-3 w-3" />
            <span className="text-sm font-medium">Text Styles</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(brandkit.typography.textStyles)
              .filter(([key]) => key !== "custom")
              .map(([name, style]) => (
                <TextStylePreview key={name} name={name} style={style} />
              ))}
          </div>
        </div>
      </Card>

      {/* Manual Controls */}
      <Card className="p-3">
        <div className="space-y-3">
          <span className="text-sm font-medium">Manual Adjustments</span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Font Size</Label>
              <Select
                value={
                  brandkit.typography.fontSizes[
                    Object.keys(brandkit.typography.fontSizes).find(
                      (key) =>
                        brandkit.typography.fontSizes[
                          key as keyof typeof brandkit.typography.fontSizes
                        ] === `${currentStyles.typography.fontSize}px`
                    ) as keyof typeof brandkit.typography.fontSizes
                  ] || "base"
                }
                onValueChange={(value) => {
                  const fontSize = parseInt(
                    brandkit.typography.fontSizes[
                      value as keyof typeof brandkit.typography.fontSizes
                    ]
                  );
                  onTypographyChange({
                    typography: {
                      ...currentStyles.typography,
                      fontSize,
                    },
                  });
                }}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(brandkit.typography.fontSizes).map(
                    ([key, size]) => (
                      <SelectItem key={key} value={key}>
                        {key} ({size})
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Font Weight</Label>
              <Select
                value={
                  Object.keys(brandkit.typography.fontWeights).find(
                    (key) =>
                      brandkit.typography.fontWeights[
                        key as keyof typeof brandkit.typography.fontWeights
                      ] === currentStyles.typography.fontWeight
                  ) || "normal"
                }
                onValueChange={(value) => {
                  const fontWeight =
                    brandkit.typography.fontWeights[
                      value as keyof typeof brandkit.typography.fontWeights
                    ];
                  onTypographyChange({
                    typography: {
                      ...currentStyles.typography,
                      fontWeight,
                    },
                  });
                }}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(brandkit.typography.fontWeights).map(
                    ([key, weight]) => (
                      <SelectItem key={key} value={key}>
                        {key} ({weight})
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
