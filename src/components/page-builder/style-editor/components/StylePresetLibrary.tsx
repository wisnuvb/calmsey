"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Eye, Grid as GridIcon, List } from "lucide-react";
import { StylePreset, Brandkit } from "@/types/brandkit";

interface StylePresetLibraryProps {
  presets: StylePreset[];
  viewMode: "grid" | "list";
  onApplyPreset: (preset: StylePreset) => void;
  brandkit?: Brandkit;
}

export function StylePresetLibrary({
  presets,
  viewMode,
  onApplyPreset,
  brandkit,
}: StylePresetLibraryProps) {
  const PresetCard = ({ preset }: { preset: StylePreset }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm">{preset.name}</CardTitle>
            {preset.description && (
              <p className="text-xs text-gray-600 mt-1">{preset.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500" />
            <span className="text-xs text-gray-500">{preset.usageCount}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            {preset.category}
          </Badge>
          {preset.sectionType && (
            <Badge variant="secondary" className="text-xs">
              {preset.sectionType}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onApplyPreset(preset)}
          >
            <Download className="h-3 w-3 mr-1" />
            Apply
          </Button>
          <Button variant="ghost" size="sm" className="px-2">
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const PresetListItem = ({ preset }: { preset: StylePreset }) => (
    <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{preset.name}</span>
          <Badge variant="outline" className="text-xs">
            {preset.category}
          </Badge>
        </div>
        {preset.description && (
          <p className="text-xs text-gray-600 mt-1">{preset.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500" />
          <span className="text-xs text-gray-500">{preset.usageCount}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onApplyPreset(preset)}
        >
          Apply
        </Button>
      </div>
    </div>
  );

  if (presets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <GridIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No presets found</p>
        <p className="text-xs mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {presets.map((preset) => (
            <PresetCard key={preset.id} preset={preset} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {presets.map((preset) => (
            <PresetListItem key={preset.id} preset={preset} />
          ))}
        </div>
      )}
    </div>
  );
}