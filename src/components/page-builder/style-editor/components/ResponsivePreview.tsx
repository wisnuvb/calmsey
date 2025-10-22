"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Tablet } from "lucide-react";
import {
  StyleSettings,
  LayoutSettings,
  ResponsiveSettings,
} from "@/types/page-builder";

interface ResponsivePreviewProps {
  device: "tablet" | "mobile";
  styles: StyleSettings;
  layout: LayoutSettings;
  responsive: ResponsiveSettings;
}

export function ResponsivePreview({
  device,
  styles,
  layout,
  responsive,
}: ResponsivePreviewProps) {
  const deviceSettings = responsive[device];
  const Icon = device === "tablet" ? Tablet : Smartphone;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {device.charAt(0).toUpperCase() + device.slice(1)} Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Visibility */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Visibility</span>
            <Badge
              variant={
                deviceSettings?.visibility === "visible"
                  ? "default"
                  : "secondary"
              }
            >
              {deviceSettings?.visibility || "visible"}
            </Badge>
          </div>

          {/* Display */}
          {deviceSettings?.display && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Display</span>
              <Badge variant="outline">{deviceSettings.display}</Badge>
            </div>
          )}

          {/* Font Size */}
          {deviceSettings?.fontSize && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Font Size</span>
              <Badge variant="outline">{deviceSettings.fontSize}px</Badge>
            </div>
          )}

          {/* Padding */}
          {deviceSettings?.padding && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Padding</span>
              <Badge variant="outline">
                {typeof deviceSettings.padding === "object"
                  ? `${deviceSettings.padding.top}px`
                  : `${deviceSettings.padding}px`}
              </Badge>
            </div>
          )}

          {/* Margin */}
          {deviceSettings?.margin && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Margin</span>
              <Badge variant="outline">
                {typeof deviceSettings.margin === "object"
                  ? `${deviceSettings.margin.top}px`
                  : `${deviceSettings.margin}px`}
              </Badge>
            </div>
          )}

          {/* Content overrides */}
          {deviceSettings?.content && (
            <div className="space-y-2">
              <span className="text-xs font-medium">Content Overrides</span>
              <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                {deviceSettings?.content.title && (
                  <div>
                    <strong>Title:</strong> {deviceSettings.content.title}
                  </div>
                )}
                {deviceSettings?.content.subtitle && (
                  <div>
                    <strong>Subtitle:</strong> {deviceSettings.content.subtitle}
                  </div>
                )}
                {deviceSettings?.content.content && (
                  <div>
                    <strong>Content:</strong>{" "}
                    {deviceSettings.content.content.substring(0, 50)}...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
