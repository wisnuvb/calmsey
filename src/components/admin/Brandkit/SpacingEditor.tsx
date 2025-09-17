// src/components/admin/Brandkit/SpacingEditor.tsx
"use client";

import { BrandkitSpacing } from "@/types/brandkit";

interface SpacingEditorProps {
  spacing: BrandkitSpacing;
  onChange: (spacing: BrandkitSpacing) => void;
}

export default function SpacingEditor({
  spacing,
  onChange,
}: SpacingEditorProps) {
  const handleBaseUnitChange = (value: number) => {
    onChange({
      ...spacing,
      baseUnit: value,
    });
  };

  const handleScaleChange = (key: string, value: string) => {
    onChange({
      ...spacing,
      scale: {
        ...spacing.scale,
        [key]: value,
      },
    });
  };

  const handleContainerSizeChange = (key: string, value: string) => {
    onChange({
      ...spacing,
      containerSizes: {
        ...spacing.containerSizes,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Spacing Configuration
        </h3>

        {/* Base Unit */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Unit (px)
          </label>
          <input
            type="number"
            value={spacing.baseUnit}
            onChange={(e) => handleBaseUnitChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min="1"
            max="16"
          />
          <p className="text-sm text-gray-500 mt-1">
            Base unit for spacing calculations (typically 4 or 8)
          </p>
        </div>

        {/* Container Sizes */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">
            Container Sizes
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(spacing.containerSizes).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key.toUpperCase()}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    handleContainerSizeChange(key, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Component Spacing */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">
            Component Spacing
          </h4>
          <div className="space-y-4">
            {Object.entries(spacing.components).map(
              ([component, componentSpacing]) => (
                <div key={component} className="border rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3 capitalize">
                    {component}
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Padding
                      </label>
                      <input
                        type="text"
                        value={componentSpacing.padding}
                        onChange={(e) => {
                          onChange({
                            ...spacing,
                            components: {
                              ...spacing.components,
                              [component]: {
                                ...componentSpacing,
                                padding: e.target.value,
                              },
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Margin
                      </label>
                      <input
                        type="text"
                        value={componentSpacing.margin}
                        onChange={(e) => {
                          onChange({
                            ...spacing,
                            components: {
                              ...spacing.components,
                              [component]: {
                                ...componentSpacing,
                                margin: e.target.value,
                              },
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
