"use client";

import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePageContent } from "@/contexts/PageContentContext";

interface QuoteSectionProps {
  quote?: string;
  className?: string;
}

export function QuoteSection({
  quote: propQuote,
  className,
}: QuoteSectionProps = {}) {
  // Try to get content from context, fallback to empty object if not available
  let pageContent: Record<string, string> = {};
  try {
    const context = usePageContent();
    pageContent = context.content;
  } catch {
    // Not in PageContentProvider, use props only
  }

  // Helper to get value from content
  const getContentValue = (key: string, defaultValue: string = ""): string => {
    return pageContent[key] || defaultValue;
  };

  // Helper function to get value with priority: context > props > default
  const getValue = (
    contentKey: string,
    propValue?: string,
    defaultValue: string = ""
  ): string => {
    const contentValue = getContentValue(contentKey, "");
    if (contentValue && contentValue.trim() !== "") {
      return contentValue;
    }
    if (propValue && propValue.trim() !== "") {
      return propValue;
    }
    return defaultValue;
  };

  // Get quote value with priority: context > props > default
  const quote = getValue(
    "quote.content",
    propQuote,
    "Flowing funds with greater control and direction of rights holders and their allies"
  );

  return (
    <section
      className={cn("bg-white py-16 lg:py-24", className)}
      data-section="quote"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center">
          {/* Left Decorative Line */}
          <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[120px] sm:w-[273px] h-[1px] bg-[#CADBEA]" />

          {/* Quote Content */}
          <div className="relative max-w-xl mx-auto text-center px-2">
            {/* Quote Icon - positioned slightly to the left */}
            <div className="flex justify-center mb-6 relative">
              <Quote className="w-5 h-5 text-[#C3CEF9] fill-[#C3CEF9] -ml-4" />
            </div>

            {/* Quote Text */}
            <blockquote className="text-[#3C62ED] text-2xl sm:text-[26px] font-bold leading-tight font-nunito-sans">
              {quote}
            </blockquote>
          </div>

          {/* Right Decorative Line */}
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[120px] sm:w-[273px] h-[1px] bg-[#CADBEA]" />
        </div>
      </div>
    </section>
  );
}
