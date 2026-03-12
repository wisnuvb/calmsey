"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "../public/LanguageProvider";

interface RichTextProps {
  content: string;
  className?: string;
}

export function RichText({ content, className }: RichTextProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleLinkClick = (e: MouseEvent) => {
      // Find the closest anchor tag that was clicked
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");

      // Check if it's an internal link (doesn't start with http/https or mailto)
      if (
        rawHref &&
        !rawHref.startsWith("http") &&
        !rawHref.startsWith("mailto:") &&
        !rawHref.startsWith("tel:")
      ) {
        // Only intercept if we are opening in the same window without modifier keys
        if (
          anchor.target !== "_blank" &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.shiftKey
        ) {
          e.preventDefault();
          // Normalize relative hash links (like "our-approach#vision" to "/our-approach#vision")
          let href = rawHref.startsWith("/") ? rawHref : `/${rawHref}`;
          
          // Inject language prefix if it's missing to avoid middleware reload which drops the hash
          if (language && !href.startsWith(`/${language}/`) && href !== `/${language}`) {
             href = `/${language}${href}`;
          }
          
          router.push(href);
        }
      }
    };

    container.addEventListener("click", handleLinkClick);

    return () => {
      container.removeEventListener("click", handleLinkClick);
    };
  }, [router]);

  return (
    <div
      ref={containerRef}
      className={cn("rich-text-content", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
