/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * HOME PAGE - Example Integration with Headless CMS
 *
 * This is an example showing how to integrate page content from database
 * into your existing components.
 *
 * To use this:
 * 1. Rename this file to `page.tsx` (replace existing)
 * 2. OR copy the pattern to your existing `page.tsx`
 */

import React from "react";
import {
  HeroSection,
  OngoingProjectsSection,
  WhereWeWorkSection,
  WhyTurningTidesSection,
  PartnerStoriesSection,
  LatestArticlesSection,
  StrategyDownloadSection,
} from "@/components/main";
import { getPageContent } from "@/lib/page-content";

interface HomePageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  // Fetch page content from database
  const content = await getPageContent("HOME", lang);

  return (
    <>
      {/*
        Hero Section - with dynamic content from CMS

        In Admin, you can edit:
        - hero.variant
        - hero.posterImage
        - hero.videoUrl
        - hero.title
        - hero.subtitle
      */}
      <HeroSection
        variant={content.getString("hero.variant", "video") as any}
        posterImage={content.getString(
          "hero.posterImage",
          "/assets/demo/bg-video.png"
        )}
        videoUrl={content.getString(
          "hero.videoUrl",
          "/assets/video/8248432-hd_1280_720_30fps.mp4"
        )}
        title={content.getString("hero.title")}
        subtitle={content.getString("hero.subtitle")}
        ctaText={content.getString("hero.ctaText", "Learn More")}
        ctaLink={content.getString("hero.ctaLink", "/about-us")}
        dataSection="hero"
      />

      {/*
        Why TurningTides Section - with dynamic content

        Admin editable fields:
        - whyUs.title
        - whyUs.content (HTML)
      */}
      <WhyTurningTidesSection
        title={content.getString("whyUs.title", "Why TurningTides")}
        content={content.getString("whyUs.content")}
      />

      {/* Partner Stories - using default implementation */}
      <PartnerStoriesSection />

      {/*
        Where We Work Section - with map image

        Admin editable:
        - whereWeWork.title
        - whereWeWork.description
        - whereWeWork.mapImage
      */}
      <WhereWeWorkSection
        title={content.getString("whereWeWork.title", "Where We Work")}
        content={content.getString("whereWeWork.content")}
        mapImage={content.getString("whereWeWork.mapImage")}
      />

      {/* Ongoing Projects - using default */}
      <OngoingProjectsSection />

      {/*
        Latest Articles Section

        Admin editable:
        - articles.title
        - articles.limit (number of articles to show)
      */}
      <LatestArticlesSection
        title={content.getString("articles.title", "Latest Articles")}
        limit={content.getNumber("articles.limit", 6)}
      />

      {/*
        Strategy Download Section

        Admin editable:
        - strategy.description
        - strategy.downloadUrl
        - strategy.buttonText
        - strategy.learnMoreButtonText
        - strategy.learnMoreButtonUrl
      */}
      <StrategyDownloadSection
        description={content.getString("strategy.description")}
        downloadUrl={content.getString("strategy.downloadUrl")}
        downloadButtonText={content.getString(
          "strategy.buttonText",
          "Download PDF"
        )}
        learnMoreButtonText={content.getString(
          "strategy.learnMoreButtonText",
          "Learn More"
        )}
        learnMoreButtonUrl={content.getString(
          "strategy.learnMoreButtonUrl",
          "/our-fund"
        )}
      />
    </>
  );
}

/**
 * MIGRATION NOTES:
 *
 * 1. If your existing components don't accept props yet:
 *    - Update component interfaces to accept optional props
 *    - Use props if provided, otherwise use default/hardcoded values
 *
 * Example:
 *
 * // Before
 * export function HeroSection() {
 *   return <div>Welcome</div>
 * }
 *
 * // After
 * interface HeroSectionProps {
 *   title?: string;
 *   subtitle?: string;
 * }
 *
 * export function HeroSection({ title = 'Default', subtitle }: HeroSectionProps) {
 *   return (
 *     <div>
 *       <h1>{title}</h1>
 *       {subtitle && <p>{subtitle}</p>}
 *     </div>
 *   )
 * }
 *
 * 2. Update component by component:
 *    - Start with Hero section
 *    - Test each change
 *    - Move to next section
 *
 * 3. Content editors can now update via:
 *    /admin/page-content/home
 */
