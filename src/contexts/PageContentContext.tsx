/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, ReactNode } from "react";

export type PageContentMap = Record<string, string>;

interface PageContentContextType {
  content: PageContentMap;
  pageType: string;
  language: string;
}

const PageContentContext = createContext<PageContentContextType | undefined>(
  undefined
);

export function PageContentProvider({
  children,
  content,
  pageType,
  language,
}: {
  children: ReactNode;
  content: PageContentMap;
  pageType: string;
  language: string;
}) {
  return (
    <PageContentContext.Provider value={{ content, pageType, language }}>
      {children}
    </PageContentContext.Provider>
  );
}

export function usePageContent() {
  const context = useContext(PageContentContext);
  if (!context) {
    throw new Error("usePageContent must be used within PageContentProvider");
  }
  return context;
}

// Helper hooks untuk akses yang lebih mudah
export function useContentValue(
  key: string,
  defaultValue: string = ""
): string {
  const { content } = usePageContent();
  return content[key] || defaultValue;
}

export function useContentJSON<T = any>(
  key: string,
  defaultValue: T | null = null
): T | null {
  const { content } = usePageContent();
  const value = content[key];
  if (!value) return defaultValue;

  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}
