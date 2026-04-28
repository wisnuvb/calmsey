"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Horizontal strip gap aligns with desktop grid (`gap-8`). */
const DEFAULT_MOBILE_SCROLL_INNER_CLASS =
  "flex gap-8 overflow-x-auto snap-x snap-mandatory pb-2 scroll-px-4 px-2 [scrollbar-width:thin]";

export interface MembersCarouselShellProps<T extends { id: string }> {
  members: readonly T[];
  membersPerPage?: number;
  /** Card node (grid / scroll item); parent assigns keys inside map */
  renderCard: (member: T) => React.ReactNode;
  /** Overrides inner flex styles for horizontal scroll strip (Tailwind classes) */
  mobileScrollInnerClassName?: string;
}

/** Presentational carousel: mobile swipe row, desktop paginated grid with side arrows and dot pager (shared by Team + Steering). */
export function MembersCarouselShell<T extends { id: string }>({
  members,
  membersPerPage = 4,
  renderCard,
  mobileScrollInnerClassName,
}: MembersCarouselShellProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages =
    members.length === 0
      ? 0
      : Math.ceil(members.length / membersPerPage);

  const startIndex = currentPage * membersPerPage;
  const currentMembers = members.slice(
    startIndex,
    startIndex + membersPerPage,
  );

  const handlePrevPage = () => {
    if (totalPages <= 1) return;
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    if (totalPages <= 1) return;
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const scrollInnerClass =
    mobileScrollInnerClassName ?? DEFAULT_MOBILE_SCROLL_INNER_CLASS;

  return (
    <>
      {/* Mobile: horizontal scroll cards */}
      <div className="sm:hidden mb-12 -mx-1 px-1">
        <div className={scrollInnerClass}>
          {members.map((member) => (
            <div
              key={member.id}
              className="snap-center shrink-0 w-[min(280px,82vw)]"
            >
              {renderCard(member)}
            </div>
          ))}
        </div>
      </div>

      {/* sm+: paginated grid with side navigation */}
      <div className="relative hidden sm:block">
        {totalPages > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevPage}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5 text-[#3C62ED]" />
            </button>
            <button
              type="button"
              onClick={handleNextPage}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5 text-[#3C62ED]" />
            </button>
          </>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {currentMembers.map((member) => (
            <div key={member.id}>{renderCard(member)}</div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="hidden sm:flex justify-center mb-12">
          <div className="flex gap-3">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={`page-dot-${index}`}
                type="button"
                onClick={() => handlePageClick(index)}
                className={cn(
                  "w-12 h-1.5 rounded-full transition-all duration-300",
                  currentPage === index
                    ? "bg-[#3C62ED]"
                    : "bg-[#E5E7EB] hover:bg-[#D1D5DB]",
                )}
                aria-label={`Go to page ${index + 1}`}
                aria-current={currentPage === index ? "true" : "false"}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
