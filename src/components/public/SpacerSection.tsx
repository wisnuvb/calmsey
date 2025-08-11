/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

interface SpacerSectionProps {
  translation: any;
  style?: React.CSSProperties;
}

export default function SpacerSection({
  translation,
  style,
}: SpacerSectionProps) {
  const metadata = translation?.metadata || {};
  const height = metadata.height || 40;

  return (
    <div
      style={{
        height: `${height}px`,
        ...style,
      }}
      className="spacer-section"
    />
  );
}
