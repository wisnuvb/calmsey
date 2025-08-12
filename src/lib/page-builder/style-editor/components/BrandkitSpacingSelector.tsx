"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid, Move } from "lucide-react";
import { Brandkit } from "@/types/brandkit";
import { LayoutSettings } from "@/types/page-builder";

interface BrandkitSpacingSelectorProps {
  brandkit: Brandkit;
  currentLayout: LayoutSettings;
  onSpacingChange: (spacing: Partial<LayoutSettings>) => void;
}

export function BrandkitSpacingSelector({
  brandkit,
  currentLayout,
  onSpacingChange,
}: BrandkitSpacingSelectorProps) {
  const applySpacing = (
    value: string,
    type: "padding" | "margin",
    side?: "top" | "right" | "bottom" | "left"
  ) => {
    const numValue = parseInt(value);

    if (side) {
      onSpacingChange({
        [type]: {
          ...currentLayout[type],
          [side]: numValue,
        },
      });
    } else {
      // Apply to all sides
      onSpacingChange({
        [type]: {
          top: numValue,
          right: numValue,
          bottom: numValue,
          left: numValue,
          unit: "px",
        },
      });
    }
  };

  const SpacingButton = ({
    value,
    label,
  }: {
    value: string;
    label: string;
  }) => (
    <Button
      variant="outline"
      className="h-12 flex-col gap-1"
      onClick={() => applySpacing(value, "padding")}
    >
      <div className="text-xs font-medium">{label}</div>
      <div className="text-xs text-gray-500">{value}</div>
    </Button>
  );

  return (
    <div className="space-y-4">
      {/* Quick Spacing Scale */}
      <Card className="p-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {/* <Spacing className="h-3 w-3" /> */}
            <span className="text-sm font-medium">Spacing Scale</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(brandkit.spacing.scale)
              .slice(0, 8)
              .map(([key, value]) => (
                <SpacingButton key={key} value={value} label={key} />
              ))}
          </div>
        </div>
      </Card>

      {/* Component Spacing Presets */}
      <Card className="p-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Grid className="h-3 w-3" />
            <span className="text-sm font-medium">Component Presets</span>
          </div>
          <div className="space-y-2">
            {Object.entries(brandkit.spacing.components).map(
              ([componentName, spacing]) => (
                <div key={componentName} className="p-2 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize">
                      {componentName}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Preset
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {Object.entries(spacing).map(([key, value]) => (
                      <Button
                        key={key}
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => {
                          if (key === "paddingX") {
                            applySpacing(value, "padding", "left");
                            applySpacing(value, "padding", "right");
                          } else if (key === "paddingY") {
                            applySpacing(value, "padding", "top");
                            applySpacing(value, "padding", "bottom");
                          }
                        }}
                      >
                        {key}: {value}
                      </Button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </Card>

      {/* Layout Spacing */}
      <Card className="p-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Move className="h-3 w-3" />
            <span className="text-sm font-medium">Layout Spacing</span>
          </div>
          <div className="space-y-2">
            {/* {Object.entries(brandkit.spacing.layout).map(([key, value]) => (
              <Button
                key={key}
                variant="outline"
                className="w-full justify-between"
                onClick={() => {
                  // Apply layout-specific spacing logic
                  if (key === "containerPadding") {
                    applySpacing(value, "padding");
                  } else if (key === "sectionSpacing") {
                    applySpacing(value, "margin", "bottom");
                  }
                }}
              >
                <span className="capitalize">
                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </span>
                <Badge variant="secondary">{value}</Badge>
              </Button>
            ))} */}
          </div>
        </div>
      </Card>
    </div>
  );
}
