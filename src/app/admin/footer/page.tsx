/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FooterLink {
  id?: string;
  label: string;
  href: string;
  target?: "SELF" | "BLANK";
  order?: number;
  isActive?: boolean;
}

interface FooterSection {
  id?: string;
  title: string;
  links: FooterLink[];
  order?: number;
  isActive?: boolean;
}

export default function FooterManagerPage() {
  // const router = useRouter();
  const { addToast } = useToast();
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFooter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFooter = async () => {
    try {
      const response = await fetch("/api/admin/footer");
      if (response.ok) {
        const data = await response.json();
        setSections(data.sections || []);
      }
    } catch (error) {
      console.error("Error fetching footer:", error);
      addToast({
        title: "Error",
        description: "Failed to load footer data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: "New Section",
        links: [],
        order: sections.length,
        isActive: true,
      },
    ]);
  };

  const updateSection = (index: number, field: string, value: any) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const deleteSection = (index: number) => {
    const updated = sections.filter((_, i) => i !== index);
    setSections(updated);
  };

  const addLink = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].links = [
      ...updated[sectionIndex].links,
      {
        label: "New Link",
        href: "/",
        target: "SELF",
        order: updated[sectionIndex].links.length,
        isActive: true,
      },
    ];
    setSections(updated);
  };

  const updateLink = (
    sectionIndex: number,
    linkIndex: number,
    field: string,
    value: any
  ) => {
    const updated = [...sections];
    updated[sectionIndex].links[linkIndex] = {
      ...updated[sectionIndex].links[linkIndex],
      [field]: value,
    };
    setSections(updated);
  };

  const deleteLink = (sectionIndex: number, linkIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].links = updated[sectionIndex].links.filter(
      (_, i) => i !== linkIndex
    );
    setSections(updated);
  };

  const saveFooter = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });

      if (response.ok) {
        addToast({
          title: "Success",
          description: "Footer saved successfully",
          type: "success",
        });
        await fetchFooter();
      } else {
        throw new Error("Failed to save footer");
      }
    } catch (error) {
      console.error("Error saving footer:", error);
      addToast({
        title: "Error",
        description: "Failed to save footer",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Footer Manager
        </h1>
        <p className="text-gray-600">
          Manage footer sections and links. Changes will be reflected on the
          frontend immediately.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="border border-gray-200 rounded-lg p-6 bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 mr-4">
                <Label htmlFor={`section-title-${sectionIndex}`}>
                  Section Title
                </Label>
                <Input
                  id={`section-title-${sectionIndex}`}
                  value={section.title}
                  onChange={(e) =>
                    updateSection(sectionIndex, "title", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteSection(sectionIndex)}
              >
                Delete Section
              </Button>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <Label>Links</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addLink(sectionIndex)}
                >
                  + Add Link
                </Button>
              </div>

              {section.links.map((link, linkIndex) => (
                <div
                  key={linkIndex}
                  className="flex gap-3 items-start p-3 bg-gray-50 rounded"
                >
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <Label
                        htmlFor={`link-label-${sectionIndex}-${linkIndex}`}
                      >
                        Label
                      </Label>
                      <Input
                        id={`link-label-${sectionIndex}-${linkIndex}`}
                        value={link.label}
                        onChange={(e) =>
                          updateLink(
                            sectionIndex,
                            linkIndex,
                            "label",
                            e.target.value
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`link-href-${sectionIndex}-${linkIndex}`}>
                        URL
                      </Label>
                      <Input
                        id={`link-href-${sectionIndex}-${linkIndex}`}
                        value={link.href}
                        onChange={(e) =>
                          updateLink(
                            sectionIndex,
                            linkIndex,
                            "href",
                            e.target.value
                          )
                        }
                        className="mt-1"
                        placeholder="/about-us"
                      />
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteLink(sectionIndex, linkIndex)}
                    className="mt-6"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Button onClick={addSection} variant="outline">
          + Add Section
        </Button>
        <Button onClick={saveFooter} disabled={saving}>
          {saving ? "Saving..." : "Save Footer"}
        </Button>
      </div>
    </div>
  );
}
