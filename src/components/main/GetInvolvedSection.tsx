"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { getImageUrl } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";
import { CountryCombobox } from "@/components/ui/country-combobox";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { getCountrySelectOptions } from "@/lib/countries";

const ENTITY_TYPE_COMBO_OPTIONS = [
  { value: "company", label: "Company" },
  { value: "institute", label: "Institute" },
  { value: "organization", label: "Organization" },
  { value: "individual", label: "Individual" },
] as const;

const PARTNERSHIP_TYPE_COMBO_OPTIONS = [
  { value: "Funding Partner", label: "Funding Partner" },
  { value: "Technical Partner", label: "Technical Partner" },
  { value: "Community Partner", label: "Community Partner" },
  { value: "Research Partner", label: "Research Partner" },
] as const;

interface GetInvolvedSectionProps {
  backgroundImage?: string;
  backgroundImageAlt?: string;
  title?: string;
  subtitle?: string;
  overlayTitle?: string;
  overlayDescription?: string;
  backgroundColor?: string;
}

/** Renders segments wrapped in ** as <strong>; rest as plain spans. */
function bannerTextWithBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-white">
        {part}
      </strong>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    ),
  );
}

/** Label field nama entitas sesuai tipe yang dipilih. */
function entityNameLabel(
  entityType: string,
): "Company name" | "Institute name" | "Organization name" {
  switch (entityType) {
    case "company":
      return "Company name";
    case "institute":
      return "Institute name";
    default:
      return "Organization name";
  }
}

export const GetInvolvedSection: React.FC<GetInvolvedSectionProps> = ({
  backgroundImage: propBackgroundImage,
  backgroundImageAlt: propBackgroundImageAlt,
  title: propTitle,
  subtitle: propSubtitle,
  overlayTitle: propOverlayTitle,
  overlayDescription: propOverlayDescription,
  backgroundColor: propBackgroundColor,
}) => {
  const { getValue } = usePageContentHelpers();
  const { addToast } = useToast();

  const backgroundImage = getValue(
    "hero.backgroundImage",
    propBackgroundImage,
    "/assets/demo/get-involved.png",
  );
  const backgroundImageAlt = getValue(
    "hero.backgroundImageAlt",
    propBackgroundImageAlt,
    "Workshop meeting with community members",
  );
  const title = getValue("hero.title", propTitle, "Get connected");
  const subtitle = getValue("hero.subtitle", propSubtitle, "");

  const overlayTitle = getValue(
    "hero.overlayTitle",
    propOverlayTitle,
    "Support tenure and surrounding human rights",
  );
  const overlayDescription = getValue(
    "hero.overlayDescription",
    propOverlayDescription,
    `Join Turning Tides in supporting Indigenous Peoples, small-scale fishers, and coastal communities to secure and control their territories—work that is inseparable from environmental and social justice`,
  );

  const backgroundColor =
    propBackgroundColor && propBackgroundColor.trim() !== ""
      ? propBackgroundColor
      : "bg-white";

  const submitButtonText = getValue(
    "cta.buttonText",
    undefined,
    "Send Message",
  );

  const bannerLeftParagraph = getValue(
    "cta.bannerLeftParagraph",
    undefined,
    "Supporting rights and tenure of local communities, small scale fishers, fish workers, and Indigenous Peoples.",
  );
  const bannerRightParagraph = getValue(
    "cta.bannerRightParagraph",
    undefined,
    `If you are a group, organization, or collective that represents or directly serves local communities, small-scale fishers or fish workers, or Indigenous Peoples, **reach out to us and share your work and aspirations here.**`,
  );
  const successToastTitle = getValue(
    "cta.successToastTitle",
    undefined,
    "Message sent",
  );
  const successToastDescription = getValue(
    "cta.successToastDescription",
    undefined,
    "Thank you! Your message has been sent.",
  );
  const messagePlaceholder = getValue(
    "cta.messagePlaceholder",
    undefined,
    "Tell us about your work, goals, or the kind of partnership you are seeking.",
  );

  const searchParams = useSearchParams();
  const becomeParam = searchParams.get("become");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    organizationName: "",
    country: "",
    partnershipType: becomeParam === "funder" ? "Funding Partner" : "",
    message: "",
  });

  useEffect(() => {
    if (becomeParam === "funder") {
      setFormData((prev) => ({ ...prev, partnershipType: "Funding Partner" }));
    }
  }, [becomeParam]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const maxChars = 5000;

  const countryOptions = useMemo(() => getCountrySelectOptions(), []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "organization" && value === "individual") {
        return { ...prev, organization: value, organizationName: "" };
      }
      return { ...prev, [name]: value };
    });

    if (name === "message") {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!formData.organization.trim()) {
      setError("Please select company, institute, organization, or individual");
      return;
    }

    if (!formData.country.trim()) {
      setError("Please select a country");
      return;
    }

    if (!formData.partnershipType.trim()) {
      setError("Please select type of partner");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/get-involved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setFormData({
        fullName: "",
        email: "",
        organization: "",
        organizationName: "",
        country: "",
        partnershipType: "",
        message: "",
      });
      setCharCount(0);
      addToast({
        type: "success",
        title: successToastTitle,
        description: successToastDescription,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`w-full ${backgroundColor} pt-20 md:pt-24`}
      data-section="get-involved"
    >
      <h1 className="sr-only">Get Involved</h1>
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[600px]">
          <div className="relative">
            <div className="absolute inset-0">
              <Image
                src={getImageUrl(backgroundImage)}
                alt={backgroundImageAlt}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>

            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center h-full">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight font-nunito">
                {overlayTitle}
              </h2>
              <p className="text-white/95 p">{overlayDescription}</p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-10">
                <h3 className="text-4xl font-bold text-gray-900 mb-2 font-nunito">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-gray-600 text-base font-work-sans">
                    {subtitle}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="sr-only">
                      Full name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      placeholder="Full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      required
                      aria-label="Full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      required
                      aria-label="Email"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="organization" className="sr-only">
                    Company / Institute / Organization / Individual
                  </label>
                  <SearchableCombobox
                    id="organization"
                    value={formData.organization}
                    onValueChange={(organization) =>
                      setFormData((prev) =>
                        organization === "individual"
                          ? {
                              ...prev,
                              organization,
                              organizationName: "",
                            }
                          : { ...prev, organization },
                      )
                    }
                    options={[...ENTITY_TYPE_COMBO_OPTIONS]}
                    placeholder="Company / Institute / Organization / Individual"
                    searchPlaceholder="Search…"
                    emptyResultsMessage="No matches"
                    listboxLabel="Type of entity"
                    listHeightClassName="h-[220px]"
                    aria-label="Company / Institute / Organization / Individual"
                  />
                </div>

                {formData.organization &&
                  formData.organization !== "individual" && (
                    <div>
                      <label htmlFor="organizationName" className="sr-only">
                        {entityNameLabel(formData.organization)}
                      </label>
                      <input
                        id="organizationName"
                        type="text"
                        name="organizationName"
                        placeholder={entityNameLabel(formData.organization)}
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        required
                        maxLength={500}
                        aria-label={entityNameLabel(formData.organization)}
                      />
                    </div>
                  )}

                <div className="relative">
                  <label htmlFor="country" className="sr-only">
                    Country
                  </label>
                  <CountryCombobox
                    id="country"
                    value={formData.country}
                    onValueChange={(country) =>
                      setFormData((prev) => ({ ...prev, country }))
                    }
                    options={countryOptions}
                    placeholder="Select country"
                    aria-label="Country"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="partnershipType" className="sr-only">
                    Partnership type
                  </label>
                  <SearchableCombobox
                    id="partnershipType"
                    value={formData.partnershipType}
                    onValueChange={(partnershipType) =>
                      setFormData((prev) => ({ ...prev, partnershipType }))
                    }
                    options={[...PARTNERSHIP_TYPE_COMBO_OPTIONS]}
                    placeholder="Type of partner"
                    searchPlaceholder="Search…"
                    emptyResultsMessage="No matches"
                    listboxLabel="Partnership type"
                    listHeightClassName="h-[220px]"
                    aria-label="Partnership type"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder={messagePlaceholder}
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    maxLength={maxChars}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm"
                    required
                    aria-label=""
                  />
                  <div className="text-right text-xs text-gray-500 mt-2">
                    {charCount} / {maxChars.toLocaleString()}
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3C62ED] hover:bg-[#3C62ED] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-8"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {submitButtonText}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#3C62ED] py-[100px] px-[120px] flex items-center justify-between gap-[70px]">
        <p className="text-white p max-w-[433px]">{bannerLeftParagraph}</p>
        <p className="text-white p max-w-[697px]">
          {bannerTextWithBold(bannerRightParagraph)}
        </p>
      </div>
    </section>
  );
};
