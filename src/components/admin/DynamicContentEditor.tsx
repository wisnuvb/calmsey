/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/DynamicContentEditor.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DynamicContentEditorProps {
  pageId: string;
  languageId: string;
  initialContent?: Record<string, any>;
}

export default function DynamicContentEditor({
  pageId,
  languageId,
  initialContent = {},
}: DynamicContentEditorProps) {
  const [content, setContent] = useState<Record<string, any>>(initialContent);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newType, setNewType] = useState("TEXT");
  const [saving, setSaving] = useState(false);

  const updateContent = (key: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      },
    }));
  };

  const addNewField = () => {
    if (!newKey || !newValue) return;

    setContent((prev) => ({
      ...prev,
      [newKey]: {
        value: newValue,
        type: newType,
        description: "",
        isRequired: false,
      },
    }));

    setNewKey("");
    setNewValue("");
    setNewType("TEXT");
  };

  const removeField = (key: string) => {
    setContent((prev) => {
      const newContent = { ...prev };
      delete newContent[key];
      return newContent;
    });
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/pages/${pageId}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, languageId }),
      });

      if (response.ok) {
        alert("Content saved successfully!");
      } else {
        alert("Failed to save content");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Error saving content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Dynamic Content</h3>

      {/* Existing content fields */}
      {Object.entries(content).map(([key, data]) => (
        <div key={key} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{key}</h4>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeField(key)}
            >
              Remove
            </Button>
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Value"
              value={data.value}
              onChange={(e) => updateContent(key, e.target.value)}
            />
            <div className="flex gap-2">
              <Select
                value={data.type}
                onValueChange={(value) =>
                  updateContent(key, { ...data, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEXT">Text</SelectItem>
                  <SelectItem value="HTML">HTML</SelectItem>
                  <SelectItem value="RICH_TEXT">Rich Text</SelectItem>
                  <SelectItem value="JSON">JSON</SelectItem>
                  <SelectItem value="IMAGE">Image</SelectItem>
                  <SelectItem value="LINK">Link</SelectItem>
                  <SelectItem value="NUMBER">Number</SelectItem>
                  <SelectItem value="BOOLEAN">Boolean</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}

      {/* Add new field */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-2">Add New Field</h4>
        <div className="space-y-2">
          <Input
            placeholder="Field key (e.g., hero.title)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
          <Textarea
            placeholder="Field value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
          <Select value={newType} onValueChange={setNewType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TEXT">Text</SelectItem>
              <SelectItem value="HTML">HTML</SelectItem>
              <SelectItem value="RICH_TEXT">Rich Text</SelectItem>
              <SelectItem value="JSON">JSON</SelectItem>
              <SelectItem value="IMAGE">Image</SelectItem>
              <SelectItem value="LINK">Link</SelectItem>
              <SelectItem value="NUMBER">Number</SelectItem>
              <SelectItem value="BOOLEAN">Boolean</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addNewField} disabled={!newKey || !newValue}>
            Add Field
          </Button>
        </div>
      </div>

      <Button onClick={saveContent} disabled={saving}>
        {saving ? "Saving..." : "Save Content"}
      </Button>
    </div>
  );
}
