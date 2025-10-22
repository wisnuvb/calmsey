/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Palette, Type, Layers, Wand2, Settings, Eye } from "lucide-react";

import {
  HeaderSettings,
  FooterSettings,
  PageLayoutConfig,
} from "@/types/layout-settings";

interface AdvancedLayoutSettingsEditorProps {
  currentConfig: PageLayoutConfig;
  onConfigChange: (config: PageLayoutConfig) => void;
  onSave: () => void;
  brandkit?: any;
}

export function AdvancedLayoutSettingsEditor({
  currentConfig,
  onConfigChange,
  onSave,
  brandkit,
}: AdvancedLayoutSettingsEditorProps) {
  const [config, setConfig] = useState<PageLayoutConfig>(currentConfig);
  const [activeTab, setActiveTab] = useState("header");
  const [showPreview, setShowPreview] = useState(false);

  const updateHeader = (updates: Partial<HeaderSettings>) => {
    const newConfig = {
      ...config,
      header: { ...config.header, ...updates },
    };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const updateFooter = (updates: Partial<FooterSettings>) => {
    const newConfig = {
      ...config,
      footer: { ...config.footer, ...updates },
    };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const updateHeaderAdvanced = (updates: any) => {
    const newConfig = {
      ...config,
      header: {
        ...config.header,
        style: {
          ...config.header.style,
          advanced: {
            ...config.header.style.advanced,
            ...updates,
          },
        },
      },
    };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const updateFooterAdvanced = (updates: any) => {
    const newConfig = {
      ...config,
      footer: {
        ...config.footer,
        style: {
          ...config.footer.style,
          advanced: {
            ...config.footer.style.advanced,
            ...updates,
          },
        },
      },
    };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Advanced Layout Settings</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={onSave}>Save Layout</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        {/* Header Settings */}
        <TabsContent value="header" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Header Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="header-enabled">Enable Header</Label>
                <Switch
                  id="header-enabled"
                  checked={config.header.enabled}
                  onCheckedChange={(enabled) => updateHeader({ enabled })}
                />
              </div>

              {config.header.enabled && (
                <>
                  <div>
                    <Label htmlFor="header-type">Header Type</Label>
                    <Select
                      value={config.header.type}
                      onValueChange={(type: any) => updateHeader({ type })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {config.header.type === "custom" && (
                    <div>
                      <Label htmlFor="custom-header">
                        Custom Header Content
                      </Label>
                      <Textarea
                        id="custom-header"
                        placeholder="Enter custom HTML for header..."
                        value={config.header.customContent || ""}
                        onChange={(e: any) =>
                          updateHeader({ customContent: e.target.value })
                        }
                        rows={6}
                      />
                    </div>
                  )}

                  {config.header.type !== "none" && (
                    <AdvancedStyleEditor
                      title="Header Styling"
                      currentStyles={config.header.style.advanced || {}}
                      onStyleChange={updateHeaderAdvanced}
                      brandkit={brandkit}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Settings */}
        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Footer Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="footer-enabled">Enable Footer</Label>
                <Switch
                  id="footer-enabled"
                  checked={config.footer.enabled}
                  onCheckedChange={(enabled) => updateFooter({ enabled })}
                />
              </div>

              {config.footer.enabled && (
                <>
                  <div>
                    <Label htmlFor="footer-type">Footer Type</Label>
                    <Select
                      value={config.footer.type}
                      onValueChange={(type: any) => updateFooter({ type })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {config.footer.type === "custom" && (
                    <div>
                      <Label htmlFor="custom-footer">
                        Custom Footer Content
                      </Label>
                      <Textarea
                        id="custom-footer"
                        placeholder="Enter custom HTML for footer..."
                        value={config.footer.customContent || ""}
                        onChange={(e: any) =>
                          updateFooter({ customContent: e.target.value })
                        }
                        rows={6}
                      />
                    </div>
                  )}

                  {config.footer.type !== "none" && (
                    <AdvancedStyleEditor
                      title="Footer Styling"
                      currentStyles={config.footer.style.advanced || {}}
                      onStyleChange={updateFooterAdvanced}
                      brandkit={brandkit}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Settings */}
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="container-width">Container Width</Label>
                <Select
                  value={config.layout.containerWidth}
                  onValueChange={(containerWidth: any) => {
                    const newConfig = {
                      ...config,
                      layout: { ...config.layout, containerWidth },
                    };
                    setConfig(newConfig);
                    onConfigChange(newConfig);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Width</SelectItem>
                    <SelectItem value="container">Container</SelectItem>
                    <SelectItem value="narrow">Narrow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="padding-top">Top Padding (px)</Label>
                  <Input
                    id="padding-top"
                    type="number"
                    value={config.layout.padding.top}
                    onChange={(e) => {
                      const newConfig = {
                        ...config,
                        layout: {
                          ...config.layout,
                          padding: {
                            ...config.layout.padding,
                            top: parseInt(e.target.value),
                          },
                        },
                      };
                      setConfig(newConfig);
                      onConfigChange(newConfig);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="padding-bottom">Bottom Padding (px)</Label>
                  <Input
                    id="padding-bottom"
                    type="number"
                    value={config.layout.padding.bottom}
                    onChange={(e) => {
                      const newConfig = {
                        ...config,
                        layout: {
                          ...config.layout,
                          padding: {
                            ...config.layout.padding,
                            bottom: parseInt(e.target.value),
                          },
                        },
                      };
                      setConfig(newConfig);
                      onConfigChange(newConfig);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="text-sm text-gray-600 mb-2">
                Preview akan ditampilkan di sini
              </div>
              {/* Preview component akan diimplementasikan */}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Advanced Style Editor Component
function AdvancedStyleEditor({
  title,
  currentStyles,
  onStyleChange,
  brandkit,
}: {
  title: string;
  currentStyles: any;
  onStyleChange: (styles: any) => void;
  brandkit?: any;
}) {
  const [activeStyleTab, setActiveStyleTab] = useState("background");

  return (
    <div className="space-y-4">
      <h4 className="font-medium">{title}</h4>

      <Tabs value={activeStyleTab} onValueChange={setActiveStyleTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="background" className="flex items-center gap-1">
            <Palette className="h-3 w-3" />
            <span className="hidden sm:inline">Background</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-1">
            <Type className="h-3 w-3" />
            <span className="hidden sm:inline">Typography</span>
          </TabsTrigger>
          <TabsTrigger value="spacing" className="flex items-center gap-1">
            <Layers className="h-3 w-3" />
            <span className="hidden sm:inline">Spacing</span>
          </TabsTrigger>
          <TabsTrigger value="border" className="flex items-center gap-1">
            <Settings className="h-3 w-3" />
            <span className="hidden sm:inline">Border</span>
          </TabsTrigger>
          <TabsTrigger value="effects" className="flex items-center gap-1">
            <Wand2 className="h-3 w-3" />
            <span className="hidden sm:inline">Effects</span>
          </TabsTrigger>
        </TabsList>

        {/* Background Tab */}
        <TabsContent value="background" className="space-y-4 mt-4">
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium">Background Type</Label>
              <Select
                value={currentStyles.background?.type || "color"}
                onValueChange={(type: any) =>
                  onStyleChange({
                    background: {
                      ...currentStyles.background,
                      type,
                    },
                  })
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">Color</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentStyles.background?.type === "color" && (
              <div>
                <Label className="text-xs font-medium">Background Color</Label>
                <Input
                  type="color"
                  value={currentStyles.background?.color || "#ffffff"}
                  onChange={(e) =>
                    onStyleChange({
                      background: {
                        ...currentStyles.background,
                        color: e.target.value,
                      },
                    })
                  }
                  className="h-8 w-16"
                />
              </div>
            )}

            {currentStyles.background?.type === "gradient" && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">
                  Gradient Direction
                </Label>
                <Select
                  value={
                    currentStyles.background?.gradient?.direction || "to right"
                  }
                  onValueChange={(direction: any) =>
                    onStyleChange({
                      background: {
                        ...currentStyles.background,
                        gradient: {
                          ...currentStyles.background?.gradient,
                          direction,
                        },
                      },
                    })
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to right">Left to Right</SelectItem>
                    <SelectItem value="to left">Right to Left</SelectItem>
                    <SelectItem value="to bottom">Top to Bottom</SelectItem>
                    <SelectItem value="to top">Bottom to Top</SelectItem>
                    <SelectItem value="to bottom right">
                      Top Left to Bottom Right
                    </SelectItem>
                    <SelectItem value="to bottom left">
                      Top Right to Bottom Left
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="text-xs font-medium">Opacity</Label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  value={[currentStyles.background?.opacity || 1 * 100]}
                  onValueChange={([value]) =>
                    onStyleChange({
                      background: {
                        ...currentStyles.background,
                        opacity: value / 100,
                      },
                    })
                  }
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-10">
                  {Math.round((currentStyles.background?.opacity || 1) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-4 mt-4">
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium">Font Family</Label>
              <Input
                value={currentStyles.typography?.fontFamily || ""}
                onChange={(e) =>
                  onStyleChange({
                    typography: {
                      ...currentStyles.typography,
                      fontFamily: e.target.value,
                    },
                  })
                }
                className="h-8"
                placeholder="Inter, sans-serif"
              />
            </div>

            <div>
              <Label className="text-xs font-medium">Font Size</Label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  value={[currentStyles.typography?.fontSize || 16]}
                  onValueChange={([value]) =>
                    onStyleChange({
                      typography: {
                        ...currentStyles.typography,
                        fontSize: value,
                      },
                    })
                  }
                  min={8}
                  max={72}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-10">
                  {currentStyles.typography?.fontSize || 16}px
                </span>
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium">Font Weight</Label>
              <Select
                value={currentStyles.typography?.fontWeight || "normal"}
                onValueChange={(weight: any) =>
                  onStyleChange({
                    typography: {
                      ...currentStyles.typography,
                      fontWeight: weight,
                    },
                  })
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">Thin (100)</SelectItem>
                  <SelectItem value="200">Extra Light (200)</SelectItem>
                  <SelectItem value="300">Light (300)</SelectItem>
                  <SelectItem value="400">Normal (400)</SelectItem>
                  <SelectItem value="500">Medium (500)</SelectItem>
                  <SelectItem value="600">Semi Bold (600)</SelectItem>
                  <SelectItem value="700">Bold (700)</SelectItem>
                  <SelectItem value="800">Extra Bold (800)</SelectItem>
                  <SelectItem value="900">Black (900)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        {/* Spacing Tab */}
        <TabsContent value="spacing" className="space-y-4 mt-4">
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium">Padding</Label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {["top", "right", "bottom", "left"].map((side) => (
                  <div key={side}>
                    <Label className="text-xs text-gray-500 capitalize">
                      {side}
                    </Label>
                    <Input
                      type="number"
                      value={
                        currentStyles.spacing?.padding?.[
                          side as keyof typeof currentStyles.spacing.padding
                        ] || 0
                      }
                      onChange={(e) =>
                        onStyleChange({
                          spacing: {
                            ...currentStyles.spacing,
                            padding: {
                              ...currentStyles.spacing?.padding,
                              [side]: parseInt(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-8"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium">Margin</Label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {["top", "right", "bottom", "left"].map((side) => (
                  <div key={side}>
                    <Label className="text-xs text-gray-500 capitalize">
                      {side}
                    </Label>
                    <Input
                      type="number"
                      value={
                        currentStyles.spacing?.margin?.[
                          side as keyof typeof currentStyles.spacing.margin
                        ] || 0
                      }
                      onChange={(e) =>
                        onStyleChange({
                          spacing: {
                            ...currentStyles.spacing,
                            margin: {
                              ...currentStyles.spacing?.margin,
                              [side]: parseInt(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="h-8"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Border Tab */}
        <TabsContent value="border" className="space-y-4 mt-4">
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium">Border Width</Label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  value={[currentStyles.border?.width || 0]}
                  onValueChange={([value]) =>
                    onStyleChange({
                      border: {
                        ...currentStyles.border,
                        width: value,
                      },
                    })
                  }
                  max={10}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-10">
                  {currentStyles.border?.width || 0}px
                </span>
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium">Border Style</Label>
              <Select
                value={currentStyles.border?.style || "solid"}
                onValueChange={(style: any) =>
                  onStyleChange({
                    border: {
                      ...currentStyles.border,
                      style,
                    },
                  })
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium">Border Color</Label>
              <Input
                type="color"
                value={currentStyles.border?.color || "#000000"}
                onChange={(e) =>
                  onStyleChange({
                    border: {
                      ...currentStyles.border,
                      color: e.target.value,
                    },
                  })
                }
                className="h-8 w-16"
              />
            </div>

            <div>
              <Label className="text-xs font-medium">Border Radius</Label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  value={[currentStyles.border?.radius || 0]}
                  onValueChange={([value]) =>
                    onStyleChange({
                      border: {
                        ...currentStyles.border,
                        radius: value,
                      },
                    })
                  }
                  max={50}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-10">
                  {currentStyles.border?.radius || 0}px
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Effects Tab */}
        <TabsContent value="effects" className="space-y-4 mt-4">
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium">Shadow</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Enable Shadow</Label>
                  <Switch
                    checked={currentStyles.shadow?.enabled || false}
                    onCheckedChange={(enabled) =>
                      onStyleChange({
                        shadow: {
                          ...currentStyles.shadow,
                          enabled,
                        },
                      })
                    }
                  />
                </div>

                {currentStyles.shadow?.enabled && (
                  <>
                    <div>
                      <Label className="text-xs font-medium">Shadow X</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Slider
                          value={[currentStyles.shadow?.x || 0]}
                          onValueChange={([value]) =>
                            onStyleChange({
                              shadow: {
                                ...currentStyles.shadow,
                                x: value,
                              },
                            })
                          }
                          min={-20}
                          max={20}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-500 w-10">
                          {currentStyles.shadow?.x || 0}px
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium">Shadow Y</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Slider
                          value={[currentStyles.shadow?.y || 0]}
                          onValueChange={([value]) =>
                            onStyleChange({
                              shadow: {
                                ...currentStyles.shadow,
                                y: value,
                              },
                            })
                          }
                          min={-20}
                          max={20}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-500 w-10">
                          {currentStyles.shadow?.y || 0}px
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium">Shadow Blur</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Slider
                          value={[currentStyles.shadow?.blur || 0]}
                          onValueChange={([value]) =>
                            onStyleChange({
                              shadow: {
                                ...currentStyles.shadow,
                                blur: value,
                              },
                            })
                          }
                          max={50}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-500 w-10">
                          {currentStyles.shadow?.blur || 0}px
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium">
                        Shadow Color
                      </Label>
                      <Input
                        type="color"
                        value={currentStyles.shadow?.color || "#000000"}
                        onChange={(e) =>
                          onStyleChange({
                            shadow: {
                              ...currentStyles.shadow,
                              color: e.target.value,
                            },
                          })
                        }
                        className="h-8 w-16"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium">Backdrop Blur</Label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  value={[currentStyles.effects?.backdropBlur || 0]}
                  onValueChange={([value]) =>
                    onStyleChange({
                      effects: {
                        ...currentStyles.effects,
                        backdropBlur: value,
                      },
                    })
                  }
                  max={20}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-10">
                  {currentStyles.effects?.backdropBlur || 0}px
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
