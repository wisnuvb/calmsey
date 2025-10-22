"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, Send } from "lucide-react";

interface GetInvolvedSectionProps {
  backgroundImage?: string;
  backgroundImageAlt?: string;
  title?: string;
  subtitle?: string;
  overlayTitle?: string;
  overlayDescription?: string;
  backgroundColor?: string;
}

export const GetInvolvedSection: React.FC<GetInvolvedSectionProps> = ({
  backgroundImage = "/assets/demo/get-involved.png",
  backgroundImageAlt = "Workshop meeting with community members",
  title = "Let's Get Involved",
  subtitle = "Together Transforming Coastal Right.",
  overlayTitle = "Support Marine Conservation & Community Rights",
  overlayDescription = "Join Turning Tides in protecting marine ecosystems and supporting community and Indigenous rights through volunteerism and collaboration.",
  backgroundColor = "bg-white",
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    country: "",
    partnershipType: "",
    message: "",
  });

  const [charCount, setCharCount] = useState(0);
  const maxChars = 5000;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "message") {
      setCharCount(value.length);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <section
      className={`w-full ${backgroundColor} py-16 md:py-24`}
      data-section="get-involved"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[600px]">
          {/* Left Column - Background Image with Overlay */}
          <div className="relative">
            <div className="absolute inset-0">
              <Image
                src={backgroundImage}
                alt={backgroundImageAlt}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>

            {/* Overlay Content */}
            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center h-full">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                {overlayTitle}
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed">
                {overlayDescription}
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {title}
                </h3>
                <p className="text-gray-600 text-lg">{subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Organization */}
                <div className="relative">
                  <select
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                    required
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

                {/* Country */}
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                    required
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

                {/* Partnership Type */}
                <div className="relative">
                  <select
                    name="partnershipType"
                    value={formData.partnershipType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                    required
                  >
                    <option value="">I want to become partner</option>
                    <option value="funding">Funding Partner</option>
                    <option value="technical">Technical Partner</option>
                    <option value="community">Community Partner</option>
                    <option value="research">Research Partner</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Message */}
                <div>
                  <textarea
                    name="message"
                    placeholder="Tell us what you want.."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    maxLength={maxChars}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    required
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {charCount} / {maxChars.toLocaleString()}
                  </div>
                </div>

                {/* reCAPTCHA */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recaptcha"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="recaptcha" className="text-sm text-gray-600">
                    I&apos;m not a robot
                  </label>
                  <div className="text-xs text-gray-500">
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy
                    </a>{" "}
                    -{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
