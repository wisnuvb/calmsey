"use client";

import { CheckCircle2 } from "lucide-react";
import { RichTextWithEmbeddedModals } from "./RichTextWithEmbeddedModals";
import { cn } from "@/lib/utils";

interface FundDetailSectionContentProps {
  content: string | string[];
  className?: string;
  /** Prefix unik untuk id modal (mis. fund-detail-grassroot-intro) */
  modalIdPrefix?: string;
}

type ContentPart = { type: "html" | "list"; content: string };

function parseListItems(ulHtml: string): string[] {
  const items: string[] = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match: RegExpExecArray | null;
  while ((match = liRegex.exec(ulHtml)) !== null) {
    items.push(match[1].trim());
  }
  return items;
}

function splitHtmlByLists(html: string): ContentPart[] {
  const parts: ContentPart[] = [];
  const regex = /(<ul[\s\S]*?<\/ul>)/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      const before = html.slice(lastIndex, match.index).trim();
      if (before) parts.push({ type: "html", content: before });
    }
    parts.push({ type: "list", content: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    const after = html.slice(lastIndex).trim();
    if (after) parts.push({ type: "html", content: after });
  }

  return parts.length > 0 ? parts : [{ type: "html", content: html }];
}

const richTextClassName =
  "text-[#060726CC] p [&_a]:text-[#3C62ED] [&_a]:underline [&_a:hover]:text-[#2d4fd6] [&_strong]:font-bold [&_strong]:text-[#010107] [&_p]:mb-4 [&_p:last-child]:mb-0";

function CheckmarkList({
  items,
  modalIdPrefix,
}: {
  items: string[];
  modalIdPrefix: string;
}) {
  return (
    <div>
      <ul className="m-0 list-none space-y-3 p-0">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-4">
            <CheckCircle2
              className="mt-0.5 h-6 w-6 flex-shrink-0 text-[#5ABF87]"
              aria-hidden
            />
            <RichTextWithEmbeddedModals
              html={item}
              className={cn(richTextClassName, "flex-1")}
              modalTitleIdPrefix={`${modalIdPrefix}-item-${index}`}
              modalSource="FUND_DETAIL"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FundDetailSectionContent({
  content,
  className,
  modalIdPrefix = "fund-detail-section",
}: FundDetailSectionContentProps) {
  const blocks = Array.isArray(content) ? content : [content];

  return (
    <div className={cn("space-y-6", className)}>
      {blocks.map((block, blockIndex) => {
        const hasList = /<ul[\s>]/i.test(block);
        const parts = hasList
          ? splitHtmlByLists(block)
          : [{ type: "html" as const, content: block }];

        return parts.map((part, partIndex) => {
          const key = `${blockIndex}-${partIndex}`;
          const partModalPrefix = `${modalIdPrefix}-b${blockIndex}-p${partIndex}`;

          if (part.type === "list") {
            const items = parseListItems(part.content);
            if (items.length === 0) return null;
            return (
              <CheckmarkList
                key={key}
                items={items}
                modalIdPrefix={partModalPrefix}
              />
            );
          }

          return (
            <RichTextWithEmbeddedModals
              key={key}
              html={part.content}
              className={cn(
                richTextClassName,
                "[&_p:has(>strong)]:mb-6 [&_p>strong]:text-xl [&_p>strong]:font-bold [&_p>strong]:text-[#010107]",
              )}
              modalTitleIdPrefix={partModalPrefix}
              modalSource="FUND_DETAIL"
            />
          );
        });
      })}
    </div>
  );
}
