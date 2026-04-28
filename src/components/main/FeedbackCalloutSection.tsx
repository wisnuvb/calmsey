"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { H2, P } from "@/components/ui/typography";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

const DEFAULT_FEEDBACK_FORM_EMBED_URL =
  "https://forms.cloud.microsoft/r/TjvKdyuTdH";

interface FeedbackCalloutSectionProps {
  title?: string;
  description?: string;
  feedbackText?: string;
  feedbackLink?: string;
  feedbackFormEmbedUrl?: string;
  learnMoreText?: string;
  learnMoreLink?: string;
  backgroundColor?: string;
}

export function FeedbackCalloutSection({
  title: propTitle,
  description: propDescription,
  feedbackText: propFeedbackText,
  feedbackLink: propFeedbackLink,
  feedbackFormEmbedUrl: propFeedbackFormEmbedUrl,
  learnMoreText: propLearnMoreText,
  learnMoreLink: propLearnMoreLink,
  backgroundColor = "bg-[#3C62ED]",
}: FeedbackCalloutSectionProps = {}) {
  const { getValue } = usePageContentHelpers();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const title = getValue(
    "feedbackCallout.title",
    propTitle,
    "We value your feedback",
  );
  const description = getValue(
    "feedbackCallout.description",
    propDescription,
    "Share your thoughts to help us continually improve our governance, practices and accountability.",
  );
  const feedbackText = getValue(
    "feedbackCallout.feedbackButtonText",
    propFeedbackText,
    "Give Feedback",
  );
  const feedbackLink = getValue(
    "feedbackCallout.feedbackButtonLink",
    propFeedbackLink,
    "/feedback",
  );
  const learnMoreText = getValue(
    "feedbackCallout.learnMoreButtonText",
    propLearnMoreText,
    "Learn More",
  );
  const learnMoreLink = getValue(
    "feedbackCallout.learnMoreButtonLink",
    propLearnMoreLink,
    "/governance",
  );
  const backgroundColorValue = getValue(
    "feedbackCallout.backgroundColor",
    backgroundColor,
    "bg-[#3C62ED]",
  );

  const embedFromCms = getValue(
    "feedbackCallout.feedbackFormEmbedUrl",
    propFeedbackFormEmbedUrl,
    DEFAULT_FEEDBACK_FORM_EMBED_URL,
  );
  const feedbackFormEmbedUrl =
    embedFromCms.trim() !== ""
      ? embedFromCms.trim()
      : DEFAULT_FEEDBACK_FORM_EMBED_URL;

  useEffect(() => {
    if (!feedbackModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [feedbackModalOpen]);

  useEffect(() => {
    if (!feedbackModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFeedbackModalOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [feedbackModalOpen]);

  return (
    <section className={`${backgroundColorValue} py-12 lg:py-16`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Title + Description */}
          <div className="space-y-6">
            <H2
              style="h2bold"
              className="text-white text-2xl sm:text-[32px] leading-[120%] tracking-normal font-bold font-nunito"
            >
              {title}
            </H2>
            <P style="p1reg" className="text-white p">
              {description}
            </P>
          </div>

          {/* Right: Buttons */}
          <div className="flex flex-col items-start lg:items-end gap-4">
            <button
              type="button"
              onClick={() => setFeedbackModalOpen(true)}
              className="inline-flex items-center justify-center gap-3 bg-white text-[#3C62ED] px-6 py-5 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 w-full sm:w-[231px]"
              aria-expanded={feedbackModalOpen}
              aria-haspopup="dialog"
            >
              {feedbackText}
            </button>
            <a
              href={learnMoreLink}
              className="inline-flex items-center justify-center gap-3 border border-white/80 text-white px-6 py-5 rounded-lg hover:bg-white/10 transition-colors duration-200 w-full sm:w-[231px]"
              aria-label={
                feedbackLink === learnMoreLink
                  ? undefined
                  : `Learn more about ${title}`
              }
            >
              {feedbackLink === learnMoreLink
                ? feedbackText
                : learnMoreText || "Learn More"}
            </a>
          </div>
        </div>
      </div>

      {feedbackModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4"
          role="presentation"
          onClick={() => setFeedbackModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-callout-modal-title"
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-200 px-4 py-3 sm:px-6">
              <h3
                id="feedback-callout-modal-title"
                className="font-nunito text-lg font-semibold text-[#010107]"
              >
                {feedbackText}
              </h3>
              <button
                type="button"
                className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                aria-label="Close"
                onClick={() => setFeedbackModalOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="min-h-[min(72vh,620px)] flex-1 bg-neutral-50">
              <iframe
                title={feedbackText}
                src={feedbackFormEmbedUrl}
                className="h-full min-h-[min(72vh,620px)] w-full border-0"
                allow="clipboard-write; encrypted-media; fullscreen"
              />
            </div>
            <div className="shrink-0 border-t border-neutral-200 px-4 py-2 sm:px-6">
              <p className="text-center text-xs text-neutral-500">
                <a
                  href={feedbackFormEmbedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3C62ED] underline hover:no-underline"
                >
                  Open form in new tab
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
