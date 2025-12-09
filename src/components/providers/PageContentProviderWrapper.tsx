import { ReactNode } from "react";
import { PageContentProvider } from "@/contexts/PageContentContext";
import type { PageContentMap } from "@/contexts/PageContentContext";

interface PageContentProviderWrapperProps {
  children: ReactNode;
  content: PageContentMap;
  pageType: string;
  language: string;
}

export function PageContentProviderWrapper({
  children,
  content,
  pageType,
  language,
}: PageContentProviderWrapperProps) {
  return (
    <PageContentProvider
      content={content}
      pageType={pageType}
      language={language}
    >
      {children}
    </PageContentProvider>
  );
}
