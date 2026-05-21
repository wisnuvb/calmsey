"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { getImageUrl } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";
import { CountryCombobox } from "@/components/ui/country-combobox";
import { getCountrySelectOptions, type CountryOption } from "@/lib/countries";

const FORM_LABEL_CLASS =
  "mb-2 block font-work-sans text-sm font-semibold text-[#010107]";
const FORM_INPUT_CLASS =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-work-sans text-sm text-[#010107] outline-none transition-colors placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#3C62ED]/40";

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
  const title = getValue("hero.title", propTitle, "Connect With Us");
  const subtitle = getValue(
    "hero.subtitle",
    propSubtitle,
    "Please tell us about the nature of your interest or connection, and we'll do our best to respond and connect you with the right person on our team.",
  );

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
  const formNote = getValue(
    "cta.formNote",
    undefined,
    "we do not accept unsolicited grant proposals through this form. For information on how we partner with grantees, please see our Grantmaking Framework and Action Plans.",
  );
  const nameLabel = getValue("cta.nameLabel", undefined, "Your name");
  const emailLabel = getValue("cta.emailLabel", undefined, "Email");
  const countryLabel = getValue(
    "cta.countryLabel",
    undefined,
    "Please indicate the country or region you are interested in",
  );
  const messageLabel = getValue("cta.messageLabel", undefined, "Your message");
  const namePlaceholder = getValue(
    "cta.namePlaceholder",
    undefined,
    "Joseph Hans",
  );
  const emailPlaceholder = getValue(
    "cta.emailPlaceholder",
    undefined,
    "example@email.com",
  );
  const countryPlaceholder = getValue(
    "cta.countryPlaceholder",
    undefined,
    "Country or region of interest",
  );

  const searchParams = useSearchParams();
  const becomeParam = searchParams.get("become");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const maxChars = 5000;

  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [countryOptionsLoading, setCountryOptionsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/countries");
        const json = (await res.json()) as {
          success?: boolean;
          data?: CountryOption[];
        };
        if (
          !cancelled &&
          res.ok &&
          json.success &&
          Array.isArray(json.data) &&
          json.data.length > 0
        ) {
          setCountryOptions(json.data);
        } else if (!cancelled) {
          setCountryOptions(getCountrySelectOptions());
        }
      } catch {
        if (!cancelled) {
          setCountryOptions(getCountrySelectOptions());
        }
      } finally {
        if (!cancelled) {
          setCountryOptionsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "message") {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!formData.country.trim()) {
      setError("Please select a country or region");
      return;
    }

    setLoading(true);

    const partnershipType =
      becomeParam === "funder" ? "Funding Partner" : "General Inquiry";

    try {
      const response = await fetch("/api/get-involved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          organization: "individual",
          organizationName: "",
          partnershipType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setFormData({
        fullName: "",
        email: "",
        country: "",
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
      <h1 className="sr-only">Connect With Us</h1>

      <div className="relative">
        {/* Desktop: latar kiri (gambar) & kanan (putih) full-bleed */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 lg:block"
          aria-hidden
        >
          <Image
            src={getImageUrl(backgroundImage)}
            alt=""
            fill
            className="object-cover object-[50%_65%] lg:object-[50%_70%]"
            priority
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-white lg:block"
          aria-hidden
        />

        <div className="container relative mx-auto px-4">
          <div className="grid min-h-0 grid-cols-1 lg:grid-cols-2 lg:min-h-[calc(100vh-5rem)]">
            {/* Left: overlay copy (sejajar kiri dengan navbar/footer) */}
            <div className="relative flex min-h-[480px] flex-col justify-end pb-10 pt-24 lg:min-h-full lg:pb-16 lg:pt-28">
              <div className="absolute inset-0 lg:hidden">
                <Image
                  src={getImageUrl(backgroundImage)}
                  alt={backgroundImageAlt}
                  fill
                  className="object-cover object-[50%_65%]"
                  priority
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
              </div>

              <div className="relative z-10 max-w-md lg:max-w-[28rem]">
                <h2 className="font-nunito text-[2rem] font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12] px-4 sm:px-0">
                  {overlayTitle}
                </h2>
                <p className="mt-4 font-work-sans p px-4 sm:px-0 leading-relaxed text-white/95 sm:mt-6 sm:text-[17px] sm:leading-[1.55]">
                  {overlayDescription}
                </p>
              </div>
            </div>

            {/* Right: form (sejajar kanan dengan navbar/footer) */}
            <div className="flex flex-col justify-center bg-white py-10 lg:bg-transparent lg:py-16 lg:pl-12 xl:pl-16">
              <div className="w-full">
                <header className="mb-8 md:mb-10">
                  <h3 className="mb-3 font-nunito text-3xl font-bold leading-tight text-[#010107] md:text-4xl">
                    {title}
                  </h3>
                  {subtitle ? (
                    <p className="font-work-sans text-base leading-relaxed text-[#4B5563]">
                      {subtitle}
                    </p>
                  ) : null}
                </header>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="fullName" className={FORM_LABEL_CLASS}>
                      {nameLabel}
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      placeholder={namePlaceholder}
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={FORM_INPUT_CLASS}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={FORM_LABEL_CLASS}>
                      {emailLabel}
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder={emailPlaceholder}
                      value={formData.email}
                      onChange={handleInputChange}
                      className={FORM_INPUT_CLASS}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className={FORM_LABEL_CLASS}>
                    {countryLabel}
                  </label>
                  <CountryCombobox
                    id="country"
                    value={formData.country}
                    onValueChange={(country) =>
                      setFormData((prev) => ({ ...prev, country }))
                    }
                    options={countryOptions}
                    disabled={countryOptionsLoading}
                    placeholder={
                      countryOptionsLoading
                        ? "Loading countries and regions…"
                        : countryPlaceholder
                    }
                    searchPlaceholder="Search country or region…"
                    className={FORM_INPUT_CLASS}
                    aria-label={countryLabel}
                  />
                </div>

                <div>
                  <label htmlFor="message" className={FORM_LABEL_CLASS}>
                    {messageLabel}
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      placeholder={messagePlaceholder}
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={8}
                      maxLength={maxChars}
                      className={`${FORM_INPUT_CLASS} min-h-[200px] resize-none pb-10`}
                      required
                    />
                    <div
                      className="pointer-events-none absolute bottom-3 right-4 font-work-sans text-xs text-gray-400"
                      aria-live="polite"
                    >
                      {charCount} / {maxChars.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-w-[160px] items-center justify-center rounded-lg bg-[#9BB5E8] px-8 py-3.5 font-work-sans text-base font-semibold text-white transition-colors hover:bg-[#8AA5DE] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending..." : submitButtonText}
                  </button>
                </div>

                {formNote ? (
                  <div className="rounded-lg bg-[#FDF8E8] px-5 py-4 font-work-sans text-sm leading-relaxed text-[#5C6B2E]">
                    <span className="font-bold">Please note:</span> {formNote}
                  </div>
                ) : null}
              </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#3C62ED] py-10 sm:py-16 lg:py-[100px]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center lg:gap-[70px]">
            <p className="max-w-[433px] text-white p">{bannerLeftParagraph}</p>
            <p className="max-w-[697px] text-white p">
              {bannerTextWithBold(bannerRightParagraph)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
