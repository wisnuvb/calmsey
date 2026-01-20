"use client";

import { H2, P } from "@/components/ui/typography";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

interface FeedbackCalloutSectionProps {
  title?: string;
  description?: string;
  feedbackText?: string;
  feedbackLink?: string;
  learnMoreText?: string;
  learnMoreLink?: string;
  backgroundColor?: string;
}

export function FeedbackCalloutSection({
  title: propTitle,
  description: propDescription,
  feedbackText: propFeedbackText,
  feedbackLink: propFeedbackLink,
  learnMoreText: propLearnMoreText,
  learnMoreLink: propLearnMoreLink,
  backgroundColor = "bg-[#3C62ED]",
}: FeedbackCalloutSectionProps = {}) {
  const { getValue } = usePageContentHelpers()

  const title = getValue(
    "feedbackCallout.title",
    propTitle,
    "We value your feedback"
  );
  const description = getValue(
    "feedbackCallout.description",
    propDescription,
    "Share your thoughts to help us continually improve our governance, practices and accountability."
  );
  const feedbackText = getValue(
    "feedbackCallout.feedbackButtonText",
    propFeedbackText,
    "Give Feedback"
  );
  const feedbackLink = getValue(
    "feedbackCallout.feedbackButtonLink",
    propFeedbackLink,
    "/feedback"
  );
  const learnMoreText = getValue(
    "feedbackCallout.learnMoreButtonText",
    propLearnMoreText,
    "Learn More"
  );
  const learnMoreLink = getValue(
    "feedbackCallout.learnMoreButtonLink",
    propLearnMoreLink,
    "/governance"
  );

  return (
    <section className={`${backgroundColor} py-12 lg:py-16`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Title + Description */}
          <div className="space-y-6">
            <H2
              style="h2bold"
              className="text-white text-2xl sm:text-[32px] leading-[120%] tracking-normal font-bold font-nunito-sans"
            >
              {title}
            </H2>
            <P
              style="p1reg"
              className="text-white text-xl leading-[140%] tracking-normal font-normal font-nunito-sans"
            >
              {description}
            </P>
          </div>

          {/* Right: Buttons */}
          <div className="flex flex-col items-start lg:items-end gap-4">
            <a
              href={feedbackLink}
              className="inline-flex items-center justify-center gap-3 bg-white text-[#3C62ED] px-6 py-5 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 w-full sm:w-[231px]"
            >
              {feedbackText}
            </a>
            <a
              href={learnMoreLink}
              className="inline-flex items-center justify-center gap-3 border border-white/80 text-white px-6 py-5 rounded-lg hover:bg-white/10 transition-colors duration-200 w-full sm:w-[231px]"
            >
              {learnMoreText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
