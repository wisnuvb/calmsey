/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/page-builder/LayoutSettingsEditor.tsx
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
import {
  HeaderSettings,
  FooterSettings,
  PageLayoutConfig,
} from "@/types/layout-settings";

interface LayoutSettingsEditorProps {
  currentConfig: PageLayoutConfig;
  onConfigChange: (config: PageLayoutConfig) => void;
  onSave: () => void;
}

export function LayoutSettingsEditor({
  currentConfig,
  onConfigChange,
  onSave,
}: LayoutSettingsEditorProps) {
  const [config, setConfig] = useState<PageLayoutConfig>(currentConfig);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Layout Settings</h2>
        <Button onClick={onSave}>Save Layout</Button>
      </div>

      <Tabs defaultValue="header" className="w-full">
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
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="header-bg">Background Color</Label>
                          <Input
                            id="header-bg"
                            type="color"
                            value={
                              config.header.style.backgroundColor || "#ffffff"
                            }
                            onChange={(e: any) =>
                              updateHeader({
                                style: {
                                  ...config.header.style,
                                  backgroundColor: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="header-text">Text Color</Label>
                          <Input
                            id="header-text"
                            type="color"
                            value={config.header.style.textColor || "#000000"}
                            onChange={(e: any) =>
                              updateHeader({
                                style: {
                                  ...config.header.style,
                                  textColor: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="header-sticky">Sticky Header</Label>
                          <Switch
                            id="header-sticky"
                            checked={config.header.style.sticky || false}
                            onCheckedChange={(sticky) =>
                              updateHeader({
                                style: { ...config.header.style, sticky },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="header-transparent">
                            Transparent Header
                          </Label>
                          <Switch
                            id="header-transparent"
                            checked={config.header.style.transparent || false}
                            onCheckedChange={(transparent) =>
                              updateHeader({
                                style: { ...config.header.style, transparent },
                              })
                            }
                          />
                        </div>
                      </div>
                    </>
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
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="footer-bg">Background Color</Label>
                          <Input
                            id="footer-bg"
                            type="color"
                            value={
                              config.footer.style.backgroundColor || "#1f2937"
                            }
                            onChange={(e) =>
                              updateFooter({
                                style: {
                                  ...config.footer.style,
                                  backgroundColor: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="footer-text">Text Color</Label>
                          <Input
                            id="footer-text"
                            type="color"
                            value={config.footer.style.textColor || "#ffffff"}
                            onChange={(e) =>
                              updateFooter({
                                style: {
                                  ...config.footer.style,
                                  textColor: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="footer-social">
                            Show Social Links
                          </Label>
                          <Switch
                            id="footer-social"
                            checked={
                              config.footer.content.showSocialLinks || false
                            }
                            onCheckedChange={(showSocialLinks) =>
                              updateFooter({
                                content: {
                                  ...config.footer.content,
                                  showSocialLinks,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="footer-contact">
                            Show Contact Info
                          </Label>
                          <Switch
                            id="footer-contact"
                            checked={
                              config.footer.content.showContactInfo || false
                            }
                            onCheckedChange={(showContactInfo) =>
                              updateFooter({
                                content: {
                                  ...config.footer.content,
                                  showContactInfo,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </>
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
    </div>
  );
}
