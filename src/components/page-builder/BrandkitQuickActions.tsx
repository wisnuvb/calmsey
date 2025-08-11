"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Wand2,
  Eye,
  RefreshCw,
  Settings,
  BarChart,
  X,
} from "lucide-react";
import { Brandkit } from "@/types/brandkit";

interface BrandkitQuickActionsProps {
  pageId: string;
  currentBrandkit?: Brandkit | null;
  sectionsCount: number;
  onApplyBrandkit: () => void;
  onOpenManager: () => void;
  onPreviewChanges: () => void;
  className?: string;
  setShowRightSidebar: (show: boolean) => void;
}

export function BrandkitQuickActions({
  pageId,
  currentBrandkit,
  sectionsCount,
  onApplyBrandkit,
  onOpenManager,
  onPreviewChanges,
  setShowRightSidebar,
  className,
}: BrandkitQuickActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickApply = async () => {
    setIsLoading(true);
    try {
      await onApplyBrandkit();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3 relative">
        <CardTitle className="text-sm flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Brandkit Actions
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowRightSidebar(false)}
          className="absolute top-2 right-2"
        >
          <X className="h-3 w-3" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Current Brandkit:</span>
          {currentBrandkit ? (
            <Badge variant="secondary" className="text-xs">
              {currentBrandkit.name}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              None Applied
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Sections:</span>
          <span className="text-xs font-medium">{sectionsCount}</span>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          {currentBrandkit ? (
            <>
              <Button
                onClick={handleQuickApply}
                disabled={isLoading}
                size="sm"
                className="w-full"
              >
                {isLoading ? (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Wand2 className="h-3 w-3 mr-1" />
                )}
                Reapply Brandkit
              </Button>
              <Button
                onClick={onPreviewChanges}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Eye className="h-3 w-3 mr-1" />
                Preview Changes
              </Button>
            </>
          ) : (
            <Button onClick={onOpenManager} size="sm" className="w-full">
              <Palette className="h-3 w-3 mr-1" />
              Apply Brandkit
            </Button>
          )}

          <Button
            onClick={onOpenManager}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Settings className="h-3 w-3 mr-1" />
            Manage Brandkit
          </Button>
        </div>

        {/* Analytics Link */}
        {currentBrandkit && (
          <div className="pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() =>
                window.open(
                  `/admin/brandkits/${currentBrandkit.id}/analytics`,
                  "_blank"
                )
              }
            >
              <BarChart className="h-3 w-3 mr-1" />
              View Analytics
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
