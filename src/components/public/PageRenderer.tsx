/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/public/PageRenderer.tsx
import React from "react";
import { PageSection, PageSectionType } from "@/types/page-builder";
// import { HeroSection } from "./sections/HeroSection";
// import { TextSection } from "./sections/TextSection";
// import { ImageSection } from "./sections/ImageSection";
// import { ContactFormSection } from "./sections/ContactFormSection";
// import { GallerySection } from "./sections/GallerySection";
// import { TestimonialSection } from "./sections/TestimonialSection";
// import { FeatureSection } from "./sections/FeatureSection";
// import { CTASection } from "./sections/CTASection";
import Image from "next/image";

interface PageRendererProps {
  sections: PageSection[];
  language: string;
  className?: string;
}

export function PageRenderer({
  sections,
  language,
  className = "",
}: PageRendererProps) {
  const activeSections = sections
    .filter((section) => section.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <div className={`page-content ${className}`}>
      {activeSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          language={language}
        />
      ))}
    </div>
  );
}

interface SectionRendererProps {
  section: PageSection;
  language: string;
}

function SectionRenderer({ section, language }: SectionRendererProps) {
  // Get translation for current language
  const translation =
    section.translations.find((t) => t.languageId === language) ||
    section.translations[0]; // Fallback to first available

  if (!translation) return null;

  // Parse settings (stored as JSON strings in database)
  const layoutSettings = section.layoutSettings
    ? JSON.parse(section.layoutSettings)
    : {};
  const styleSettings = section.styleSettings
    ? JSON.parse(section.styleSettings)
    : {};
  const responsiveSettings = section.responsiveSettings
    ? JSON.parse(section.responsiveSettings)
    : {};
  const animationSettings = section.animationSettings
    ? JSON.parse(section.animationSettings)
    : {};
  const customSettings = section.customSettings
    ? JSON.parse(section.customSettings)
    : {};

  // Build section props
  const sectionProps = {
    id: section.id,
    translation,
    layoutSettings,
    styleSettings,
    responsiveSettings,
    animationSettings,
    customSettings,
  };

  // Generate CSS classes
  const cssClasses = [
    "page-section",
    `section-${section.type.toLowerCase()}`,
    layoutSettings.cssClasses || [],
    responsiveSettings.mobileClasses || [],
    responsiveSettings.tabletClasses || [],
    responsiveSettings.desktopClasses || [],
  ]
    .flat()
    .filter(Boolean)
    .join(" ");

  // Generate inline styles
  const inlineStyles: React.CSSProperties = {
    ...generateLayoutStyles(layoutSettings),
    ...generateStyleStyles(styleSettings),
    ...generateResponsiveStyles(responsiveSettings),
  };

  // Add custom CSS if provided
  if (customSettings.customCSS) {
    // Inject custom CSS (consider using styled-components or CSS-in-JS for better performance)
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      #section-${section.id} {
        ${customSettings.customCSS}
      }
    `;
    document.head.appendChild(styleElement);
  }

  const commonProps = {
    ...sectionProps,
    className: cssClasses,
    style: inlineStyles,
    id: `section-${section.id}`,
  };

  // Render appropriate section component
  switch (section.type) {
    case PageSectionType.HERO:
      return <HeroSection {...commonProps} />;

    case PageSectionType.RICH_TEXT:
      return <TextSection {...commonProps} />;

    case PageSectionType.IMAGE:
      return <ImageSection {...commonProps} />;

    case PageSectionType.IMAGE:
      return <ImageTextSection {...commonProps} />;

    case PageSectionType.IMAGE_GALLERY:
      return <GallerySection {...commonProps} />;

    case PageSectionType.CONTACT_FORM:
      return <ContactFormSection {...commonProps} />;

    case PageSectionType.TESTIMONIALS:
      return <TestimonialSection {...commonProps} />;

    case PageSectionType.FEATURED_CONTENT:
      return <FeatureSection {...commonProps} />;

    // case PageSectionType.CTA:
    //   return <CTASection {...commonProps} />;

    case PageSectionType.VIDEO_EMBED:
      return <VideoSection {...commonProps} />;

    case PageSectionType.ACCORDION:
      return <AccordionSection {...commonProps} />;

    case PageSectionType.TABS:
      return <TabsSection {...commonProps} />;

    case PageSectionType.PRICING_TABLE:
      return <PricingSection {...commonProps} />;

    case PageSectionType.TEAM_SHOWCASE:
      return <TeamSection {...commonProps} />;

    case PageSectionType.ARTICLE_LIST:
      return <BlogListSection {...commonProps} />;

    case PageSectionType.CUSTOM_HTML:
      return <CustomHTMLSection {...commonProps} />;

    default:
      console.warn(`Unknown section type: ${section.type}`);
      return (
        <div className="section-error">
          Unknown section type: {section.type}
        </div>
      );
  }
}

// Utility functions for generating styles
function generateLayoutStyles(layoutSettings: any): React.CSSProperties {
  return {
    width: layoutSettings.width || "100%",
    maxWidth: layoutSettings.maxWidth || "none",
    margin: layoutSettings.margin || "0",
    padding: layoutSettings.padding || "0",
    display: layoutSettings.display || "block",
    justifyContent: layoutSettings.justifyContent || "flex-start",
    alignItems: layoutSettings.alignItems || "stretch",
    textAlign: layoutSettings.textAlign || "left",
    position: layoutSettings.position || "static",
    top: layoutSettings.top || "auto",
    right: layoutSettings.right || "auto",
    bottom: layoutSettings.bottom || "auto",
    left: layoutSettings.left || "auto",
    zIndex: layoutSettings.zIndex || "auto",
  };
}

function generateStyleStyles(styleSettings: any): React.CSSProperties {
  return {
    backgroundColor: styleSettings.backgroundColor || "transparent",
    backgroundImage: styleSettings.backgroundImage || "none",
    backgroundSize: styleSettings.backgroundSize || "auto",
    backgroundPosition: styleSettings.backgroundPosition || "0% 0%",
    backgroundRepeat: styleSettings.backgroundRepeat || "repeat",
    color: styleSettings.textColor || "inherit",
    fontSize: styleSettings.fontSize || "inherit",
    fontFamily: styleSettings.fontFamily || "inherit",
    fontWeight: styleSettings.fontWeight || "inherit",
    lineHeight: styleSettings.lineHeight || "inherit",
    border: styleSettings.border || "none",
    borderRadius: styleSettings.borderRadius || "0",
    boxShadow: styleSettings.boxShadow || "none",
    opacity: styleSettings.opacity || 1,
    transform: styleSettings.transform || "none",
  };
}

function generateResponsiveStyles(
  responsiveSettings: any
): React.CSSProperties {
  // Base styles - will be enhanced with media queries in CSS
  const baseStyles: React.CSSProperties = {};

  if (responsiveSettings.mobile?.display) {
    baseStyles["--mobile-display"] = responsiveSettings.mobile.display;
  }
  if (responsiveSettings.tablet?.display) {
    baseStyles["--tablet-display"] = responsiveSettings.tablet.display;
  }
  if (responsiveSettings.desktop?.display) {
    baseStyles["--desktop-display"] = responsiveSettings.desktop.display;
  }

  return baseStyles;
}

// Example section components
function ImageTextSection({ translation, layoutSettings, ...props }: any) {
  const content = JSON.parse(translation.content || "{}");

  return (
    <section {...props}>
      <div className="container mx-auto px-4 py-8">
        <div
          className={`grid ${
            layoutSettings.imagePosition === "right"
              ? "md:grid-cols-2"
              : "md:grid-cols-2"
          } gap-8 items-center`}
        >
          <div
            className={
              layoutSettings.imagePosition === "right" ? "order-2" : "order-1"
            }
          >
            <Image
              src={content.imageUrl}
              alt={translation.altText || content.imageAlt}
              className="w-full h-auto rounded-lg shadow-lg"
              width={500}
              height={300}
            />
          </div>
          <div
            className={
              layoutSettings.imagePosition === "right" ? "order-1" : "order-2"
            }
          >
            {translation.title && (
              <h2 className="text-3xl font-bold mb-4">{translation.title}</h2>
            )}
            {translation.subtitle && (
              <h3 className="text-xl text-gray-600 mb-6">
                {translation.subtitle}
              </h3>
            )}
            <div
              className="prose prose-lg"
              dangerouslySetInnerHTML={{ __html: translation.content }}
            />
            {content.buttonText && content.buttonUrl && (
              <a
                href={content.buttonUrl}
                className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {content.buttonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoSection({ translation, ...props }: any) {
  const content = JSON.parse(translation.content || "{}");

  return (
    <section {...props}>
      <div className="container mx-auto px-4 py-8">
        {translation.title && (
          <h2 className="text-3xl font-bold text-center mb-8">
            {translation.title}
          </h2>
        )}
        <div className="max-w-4xl mx-auto">
          {content.videoType === "youtube" ? (
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${content.youtubeId}`}
                title={translation.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          ) : (
            <video
              controls
              className="w-full rounded-lg shadow-lg"
              poster={content.posterImage}
            >
              <source src={content.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {translation.caption && (
            <p className="text-center text-gray-600 mt-4">
              {translation.caption}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function AccordionSection({ translation, ...props }: any) {
  const content = JSON.parse(translation.content || "{}");
  const [openIndex, setOpenIndex] = React.useState<number | null>(
    content.defaultOpen || null
  );

  return (
    <section {...props}>
      <div className="container mx-auto px-4 py-8">
        {translation.title && (
          <h2 className="text-3xl font-bold text-center mb-8">
            {translation.title}
          </h2>
        )}
        <div className="max-w-3xl mx-auto space-y-4">
          {content.items?.map((item: any, index: number) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-white">
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TabsSection({ translation, ...props }: any) {
  const content = JSON.parse(translation.content || "{}");
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <section {...props}>
      <div className="container mx-auto px-4 py-8">
        {translation.title && (
          <h2 className="text-3xl font-bold text-center mb-8">
            {translation.title}
          </h2>
        )}
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {content.tabs?.map((tab: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === index
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {content.tabs?.[activeTab] && (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: content.tabs[activeTab].content,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection({ translation, ...props }: any) {
  const content = JSON.parse(translation.content || "{}");

  return (
    <section {...props}>
      <div className="container mx-auto px-4 py-8">
        {translation.title && (
          <h2 className="text-3xl font-bold text-center mb-4">
            {translation.title}
          </h2>
        )}
        {translation.subtitle && (
          <p className="text-xl text-gray-600 text-center mb-12">
            {translation.subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {content.plans?.map((plan: any, index: number) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                plan.featured ? "ring-2 ring-blue-500 transform scale-105" : ""
              }`}
            >
              {plan.featured && (
                <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-center mb-4">
                  {plan.name}
                </h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features?.map(
                    (feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    )
                  )}
                </ul>
                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.featured
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.buttonText || "Get Started"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection({ translation, ...props }: any) {
  const content = JSON.parse(translation.content || "{}");

  return (
    <section {...props}>
      <div className="container mx-auto px-4 py-8">
        {translation.title && (
          <h2 className="text-3xl font-bold text-center mb-4">
            {translation.title}
          </h2>
        )}
        {translation.subtitle && (
          <p className="text-xl text-gray-600 text-center mb-12">
            {translation.subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {content.members?.map((member: any, index: number) => (
            <div key={index} className="text-center">
              <div className="mb-4">
                <Image
                  src={member.photo}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover"
                  width={128}
                  height={128}
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-gray-600 mb-4">{member.position}</p>
              {member.bio && (
                <p className="text-gray-700 text-sm mb-4">{member.bio}</p>
              )}
              {member.social && (
                <div className="flex justify-center space-x-3">
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <span className="sr-only">LinkedIn</span>
                      {/* LinkedIn icon */}
                    </a>
                  )}
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <span className="sr-only">Twitter</span>
                      {/* Twitter icon */}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogListSection({ translation, ...props }: any) {
  // This would typically fetch from your blog/articles API
  const [articles, setArticles] = React.useState([]);

  React.useEffect(() => {
    // Fetch articles based on content settings
    // fetchArticles(content.category, content.limit).then(setArticles);
  }, []);

  return (
    <section {...props}>
      <div className="container mx-auto px-4 py-8">
        {translation.title && (
          <h2 className="text-3xl font-bold text-center mb-12">
            {translation.title}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: any) => (
            <article
              key={article.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {article.featuredImage && (
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                  width={500}
                  height={300}
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  <a
                    href={`/articles/${article.slug}`}
                    className="hover:text-blue-600"
                  >
                    {article.title}
                  </a>
                </h3>
                {article.excerpt && (
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <span>{article.author.name}</span>
                  <span className="mx-2">•</span>
                  <time>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomHTMLSection({ translation, customSettings, ...props }: any) {
  const content = JSON.parse(translation.content || "{}");

  // Execute custom JavaScript if provided
  React.useEffect(() => {
    if (customSettings.customJS) {
      try {
        // Create a new function to execute the custom JS in a controlled scope
        const script = new Function("element", customSettings.customJS);
        const element = document.getElementById(`section-${props.id}`);
        if (element) {
          script(element);
        }
      } catch (error) {
        console.error("Error executing custom JavaScript:", error);
      }
    }
  }, [customSettings.customJS, props.id]);

  return (
    <section {...props}>
      <div
        dangerouslySetInnerHTML={{
          __html: content.html || translation.content,
        }}
      />
    </section>
  );
}

// Export the main renderer
export default PageRenderer;
