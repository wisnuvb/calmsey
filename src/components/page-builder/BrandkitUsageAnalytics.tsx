/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Copy,
  Clock,
  TrendingUp,
  Eye,
  ExternalLink,
} from "lucide-react";

interface BrandkitUsageAnalyticsProps {
  brandkitId: string;
  className?: string;
}

export function BrandkitUsageAnalytics({
  brandkitId,
  className = "",
}: BrandkitUsageAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const [pagesRes, templatesRes] = await Promise.all([
          fetch(`/api/brandkits/${brandkitId}/pages?analytics=true`),
          fetch(`/api/brandkits/${brandkitId}/templates`),
        ]);

        if (pagesRes.ok) {
          const pagesData = await pagesRes.json();
          setPages(pagesData.pages || []);
          setAnalytics(pagesData.analytics);
        }

        if (templatesRes.ok) {
          const templatesData = await templatesRes.json();
          setTemplates(templatesData.templates || []);
        }
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [brandkitId]);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">
                  Total Pages
                </span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {analytics.totalPages}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">
                  Published
                </span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {analytics.publishedPages}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-600">
                  Drafts
                </span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {analytics.draftPages}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Copy className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">
                  Templates
                </span>
              </div>
              <div className="text-2xl font-bold mt-2">{templates.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics */}
      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pages Using This Brandkit</CardTitle>
              <CardDescription>
                All pages currently using this brandkit
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pages.length > 0 ? (
                <div className="space-y-3">
                  {pages.map((page) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">
                            {page.translations[0]?.title || "Untitled"}
                          </h4>
                          <Badge
                            variant={
                              page.status === "PUBLISHED"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {page.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          /{page.slug}
                        </p>
                        <p className="text-xs text-gray-500">
                          Updated{" "}
                          {new Date(page.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/${page.slug}`, "_blank")}
                          disabled={page.status !== "PUBLISHED"}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `/admin/pages/${page.id}/edit`,
                              "_blank"
                            )
                          }
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No pages are using this brandkit yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Templates Using This Brandkit</CardTitle>
              <CardDescription>
                Templates that have been styled with this brandkit
              </CardDescription>
            </CardHeader>
            <CardContent>
              {templates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          {template.previewImage && (
                            <img
                              src={template.previewImage}
                              alt={template.name}
                              className="w-full h-32 object-cover rounded"
                            />
                          )}
                          <h4 className="font-medium">{template.name}</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">{template.category}</Badge>
                            <Badge variant="outline">
                              {template.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Downloads: {template.downloadCount}</span>
                            {template.rating && (
                              <span>Rating: {template.rating.toFixed(1)}</span>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() =>
                              window.open(
                                `/admin/templates/${template.id}`,
                                "_blank"
                              )
                            }
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Copy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No templates are using this brandkit yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Recent pages and templates updated with this brandkit
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.recentUsage?.length > 0 ? (
                <div className="space-y-3">
                  {analytics.recentUsage.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <h4 className="font-medium">
                          {item.translations[0]?.title || "Untitled"}
                        </h4>
                        <p className="text-sm text-gray-600">/{item.slug}</p>
                        <p className="text-xs text-gray-500">
                          Updated{" "}
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(`/admin/pages/${item.id}/edit`, "_blank")
                        }
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
