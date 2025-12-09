/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/PageBuilder.tsx
"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PlusIcon,
  TrashIcon,
  EyeIcon,
  Bars3Icon,
  PhotoIcon,
  DocumentTextIcon,
  PlayIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

export interface PageSection {
  id: string;
  type:
    | "HERO"
    | "TEXT"
    | "IMAGE"
    | "IMAGE_TEXT"
    | "GALLERY"
    | "VIDEO"
    | "CONTACT_FORM"
    | "CTA";
  order: number;
  content: {
    title?: string;
    content?: string;
    image?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
}

interface PageBuilderProps {
  pageId?: string;
  initialSections?: PageSection[];
  onSave: (sections: PageSection[]) => void;
}

// Sortable Item Component
function SortableSection({
  section,
  onUpdate,
  onRemove,
}: {
  section: PageSection;
  onUpdate: (content: any) => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-gray-200 rounded-lg ${
        isDragging ? "shadow-lg opacity-50" : ""
      }`}
    >
      <SectionEditor
        section={section}
        onUpdate={onUpdate}
        onRemove={onRemove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default function PageBuilder({
  pageId,
  initialSections = [],
  onSave,
}: PageBuilderProps) {
  const [sections, setSections] = useState<PageSection[]>(initialSections);
  const [previewMode, setPreviewMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sectionTypes = [
    {
      type: "HERO",
      name: "Hero Section",
      icon: PhotoIcon,
      description: "Large banner with background image",
    },
    {
      type: "TEXT",
      name: "Text Block",
      icon: DocumentTextIcon,
      description: "Rich text content",
    },
    {
      type: "IMAGE",
      name: "Image",
      icon: PhotoIcon,
      description: "Single image with caption",
    },
    {
      type: "IMAGE_TEXT",
      name: "Image + Text",
      icon: DocumentTextIcon,
      description: "Image with text content",
    },
    {
      type: "VIDEO",
      name: "Video",
      icon: PlayIcon,
      description: "Embedded video content",
    },
    {
      type: "CONTACT_FORM",
      name: "Contact Form",
      icon: PhoneIcon,
      description: "Contact form widget",
    },
    {
      type: "CTA",
      name: "Call to Action",
      icon: PlusIcon,
      description: "Button with action",
    },
  ];

  const addSection = (type: string) => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type: type as any,
      order: sections.length,
      content: {
        title: `New ${type} Section`,
        content: "Edit this content...",
      },
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.id !== sectionId));
  };

  const updateSection = (sectionId: string, content: any) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, content: { ...s.content, ...content } } : s
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex(
        (section) => section.id === active.id
      );
      const newIndex = sections.findIndex((section) => section.id === over?.id);

      const reorderedSections = arrayMove(sections, oldIndex, newIndex);

      // Update order
      const updatedSections = reorderedSections.map((section, index) => ({
        ...section,
        order: index,
      }));

      setSections(updatedSections);
    }
  };

  const handleSave = () => {
    onSave(sections);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Page Builder</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              {previewMode ? "Edit" : "Preview"}
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Page
            </button>
          </div>
        </div>
      </div>

      {previewMode ? (
        // Preview Mode
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 text-center">
              Preview Mode - This is how your page will look
            </p>
          </div>
          {sections.map((section) => (
            <PageSectionPreview key={section.id} section={section} />
          ))}
        </div>
      ) : (
        // Edit Mode
        <div className="p-6">
          {/* Add Section Toolbar */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Add Section
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {sectionTypes.map((sectionType) => (
                <button
                  key={sectionType.type}
                  onClick={() => addSection(sectionType.type)}
                  className="flex flex-col items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                  title={sectionType.description}
                >
                  <sectionType.icon className="h-6 w-6 text-gray-500 mb-1" />
                  <span className="text-xs text-gray-700 text-center">
                    {sectionType.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sections List */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {sections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    onUpdate={(content) => updateSection(section.id, content)}
                    onRemove={() => removeSection(section.id)}
                  />
                ))}

                {sections.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No sections yet. Add your first section above.</p>
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}

// Section Editor Component
function SectionEditor({
  section,
  onUpdate,
  onRemove,
  dragHandleProps,
}: {
  section: PageSection;
  onUpdate: (content: any) => void;
  onRemove: () => void;
  dragHandleProps: any;
}) {
  return (
    <div className="bg-white border rounded-lg">
      {/* Section Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div {...dragHandleProps} className="cursor-move">
            <Bars3Icon className="h-5 w-5 text-gray-400" />
          </div>
          <h4 className="font-medium text-gray-900">
            {section.type.replace("_", " ")} Section
          </h4>
        </div>
        <button onClick={onRemove} className="text-red-600 hover:text-red-900">
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Section Content */}
      <div className="p-4 space-y-4">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={section.content.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Section title..."
          />
        </div>

        {/* Content Field */}
        {["TEXT", "IMAGE_TEXT", "HERO"].includes(section.type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={section.content.content || ""}
              onChange={(e) => onUpdate({ content: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Section content..."
            />
          </div>
        )}

        {/* Image Field */}
        {["IMAGE", "IMAGE_TEXT", "HERO"].includes(section.type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={section.content.image || ""}
              onChange={(e) => onUpdate({ image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        )}

        {/* Button Fields for CTA */}
        {section.type === "CTA" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={section.content.buttonText || ""}
                onChange={(e) => onUpdate({ buttonText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Learn More"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button URL
              </label>
              <input
                type="url"
                value={section.content.buttonUrl || ""}
                onChange={(e) => onUpdate({ buttonUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/contact"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Preview Component
function PageSectionPreview({ section }: { section: PageSection }) {
  const renderSection = () => {
    switch (section.type) {
      case "HERO":
        return (
          <div className="relative bg-gray-900 py-24 px-6 text-center text-white mb-8">
            {section.content.image && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50"
                style={{ backgroundImage: `url(${section.content.image})` }}
              />
            )}
            <div className="relative">
              <h1 className="text-4xl font-bold mb-4">
                {section.content.title}
              </h1>
              <p className="text-xl">{section.content.content}</p>
            </div>
          </div>
        );

      case "TEXT":
        return (
          <div className="prose max-w-none mb-8">
            <h2>{section.content.title}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: section.content.content || "",
              }}
            />
          </div>
        );

      case "IMAGE":
        return (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              {section.content.title}
            </h3>
            {section.content.image && (
              <Image
                src={getImageUrl(section.content.image)}
                alt={section.content.title ?? ""}
                className="w-full h-64 object-cover rounded-lg"
                width={1000}
                height={1000}
              />
            )}
          </div>
        );

      case "CTA":
        return (
          <div className="bg-blue-50 p-8 text-center rounded-lg mb-8">
            <h3 className="text-2xl font-bold mb-4">{section.content.title}</h3>
            <p className="mb-6">{section.content.content}</p>
            <a
              href={section.content.buttonUrl}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              {section.content.buttonText || "Learn More"}
            </a>
          </div>
        );

      default:
        return (
          <div className="bg-gray-100 p-4 rounded-lg mb-8">
            <p className="text-gray-600">Preview for {section.type} section</p>
          </div>
        );
    }
  };

  return renderSection();
}
