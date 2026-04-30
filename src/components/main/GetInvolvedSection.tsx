"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Send } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { usePageContentHelpers } from "@/hooks/usePageContentHelpers";

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

  const searchParams = useSearchParams();
  const becomeParam = searchParams.get("become");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const maxChars = 5000;

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

    setLoading(true);
    setError("");

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

      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        organization: "",
        country: "",
        partnershipType: "",
        message: "",
      });
      setCharCount(0);
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
                  <select
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                    required
                    aria-label="Company / Institute / Organization / Individual"
                  >
                    <option value="">
                      Company / Institute / Organization / Individual
                    </option>
                    <option value="company">Company</option>
                    <option value="institute">Institute</option>
                    <option value="organization">Organization</option>
                    <option value="individual">Individual</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <label htmlFor="country" className="sr-only">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                    required
                    aria-label="Country"
                  >
                    <option value="">Select Country</option>
                    <option value="indonesia">Indonesia</option>
                    <option value="philippines">Philippines</option>
                    <option value="malaysia">Malaysia</option>
                    <option value="thailand">Thailand</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <label htmlFor="partnershipType" className="sr-only">
                    Partnership type
                  </label>
                  <select
                    id="partnershipType"
                    name="partnershipType"
                    value={formData.partnershipType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                    required
                    aria-label="Partnership type"
                  >
                    <option value="">Type of partner</option>
                    <option value="Funding Partner">Funding Partner</option>
                    <option value="Technical Partner">Technical Partner</option>
                    <option value="Community Partner">Community Partner</option>
                    <option value="Research Partner">Research Partner</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                <div>
                  <label htmlFor="message" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us what you want..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    maxLength={maxChars}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm"
                    required
                    aria-label="Tell us what you want"
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

                {success && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    Thank you! Your message has been sent.
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
