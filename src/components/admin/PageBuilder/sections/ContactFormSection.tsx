/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/PageBuilder/sections/ContactFormSection.tsx
"use client";

import React, { useState } from "react";
import { SectionWrapper } from "../SectionRenderer";

interface ContactFormSectionProps {
  section: any;
  translation: any;
  layoutSettings: any;
  styleSettings: any;
  contentSettings: any;
  customSettings: any;
  animationSettings: any;
  viewMode: "desktop" | "tablet" | "mobile";
  isEditing: boolean;
  onClick?: () => void;
}

export default function ContactFormSection({
  section,
  translation,
  layoutSettings,
  styleSettings,
  contentSettings,
  customSettings,
  animationSettings,
  viewMode,
  isEditing,
  onClick,
}: ContactFormSectionProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const formSettings = contentSettings.form || {};
  const generalSettings = contentSettings.general || {};
  const fields = formSettings.fields || [];

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Validate required fields
      const requiredFields = fields.filter((field: any) => field.required);
      const missingFields = requiredFields.filter(
        (field: any) => !formData[field.id]?.trim()
      );

      if (missingFields.length > 0) {
        throw new Error(
          `Please fill in required fields: ${missingFields
            .map((f: any) => f.label)
            .join(", ")}`
        );
      }

      // Submit form data
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sectionId: section.id,
          formType: formSettings.formType || "contact",
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({});

        // Redirect if URL provided
        if (formSettings.redirectUrl) {
          setTimeout(() => {
            window.location.href = formSettings.redirectUrl;
          }, 2000);
        }
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: any) => {
    const value = formData[field.id] || "";
    const hasError =
      field.required && submitStatus === "error" && !value?.trim();

    const baseClasses = `w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
      hasError
        ? "border-red-500 bg-red-50"
        : "border-gray-300 focus:border-blue-500"
    }`;

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            key={field.id}
            id={field.id}
            name={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className={baseClasses}
            disabled={isEditing}
          />
        );

      case "select":
        return (
          <select
            key={field.id}
            id={field.id}
            name={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            className={baseClasses}
            disabled={isEditing}
          >
            <option value="">
              {field.placeholder || `Select ${field.label}`}
            </option>
            {field.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div key={field.id} className="flex items-start space-x-3">
            <input
              type="checkbox"
              id={field.id}
              name={field.id}
              checked={value || false}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              required={field.required}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isEditing}
            />
            <label
              htmlFor={field.id}
              className="text-sm text-gray-700 leading-5"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );

      case "radio":
        return (
          <div key={field.id} className="space-y-2">
            <div className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            {field.options?.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-3">
                <input
                  type="radio"
                  id={`${field.id}_${option.value}`}
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  disabled={isEditing}
                />
                <label
                  htmlFor={`${field.id}_${option.value}`}
                  className="text-sm text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case "file":
        return (
          <input
            key={field.id}
            type="file"
            id={field.id}
            name={field.id}
            onChange={(e) => handleInputChange(field.id, e.target.files?.[0])}
            accept={field.accept}
            multiple={field.multiple}
            required={field.required}
            className={baseClasses}
            disabled={isEditing}
          />
        );

      default:
        return (
          <input
            key={field.id}
            type={field.type || "text"}
            id={field.id}
            name={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseClasses}
            disabled={isEditing}
          />
        );
    }
  };

  return (
    <SectionWrapper
      layoutSettings={layoutSettings}
      styleSettings={styleSettings}
      animationSettings={animationSettings}
      customSettings={customSettings}
      isEditing={isEditing}
      onClick={onClick}
      className="contact-form-section"
    >
      <div
        className={`mx-auto ${
          viewMode === "mobile"
            ? "max-w-sm"
            : viewMode === "tablet"
            ? "max-w-2xl"
            : "max-w-3xl"
        }`}
      >
        {/* Section Title */}
        {generalSettings.showTitle && translation?.title && (
          <h2
            className={`font-bold mb-6 ${
              viewMode === "mobile"
                ? "text-2xl"
                : viewMode === "tablet"
                ? "text-3xl"
                : "text-4xl"
            }`}
            style={{
              color: styleSettings.textColor,
              textAlign: layoutSettings.alignment || "center",
            }}
          >
            {translation.title}
          </h2>
        )}

        {/* Section Description */}
        {generalSettings.showDescription && translation?.content && (
          <div
            className={`mb-8 ${
              layoutSettings.alignment === "center"
                ? "text-center"
                : layoutSettings.alignment === "right"
                ? "text-right"
                : "text-left"
            }`}
            style={{ color: styleSettings.textColor, opacity: 0.8 }}
            dangerouslySetInnerHTML={{ __html: translation.content }}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field: any) => (
            <div key={field.id}>
              {field.type !== "checkbox" && field.type !== "radio" && (
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ color: styleSettings.textColor }}
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
              )}
              {renderField(field)}
              {field.validation?.message && (
                <p className="mt-1 text-xs text-gray-500">
                  {field.validation.message}
                </p>
              )}
            </div>
          ))}

          {/* reCAPTCHA Placeholder */}
          {formSettings.enableRecaptcha && !isEditing && (
            <div className="bg-gray-100 border border-gray-300 rounded-md p-4 text-center text-sm text-gray-600">
              reCAPTCHA verification would appear here
            </div>
          )}

          {/* Submit Button */}
          <div
            className={`${
              layoutSettings.alignment === "center"
                ? "text-center"
                : layoutSettings.alignment === "right"
                ? "text-right"
                : "text-left"
            }`}
          >
            <button
              type="submit"
              disabled={isSubmitting || isEditing}
              className={`inline-flex items-center px-8 py-3 text-base font-medium rounded-md transition-colors ${
                isSubmitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              } ${isEditing ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Submitting...
                </>
              ) : (
                formSettings.submitButtonText || "Send Message"
              )}
            </button>
          </div>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-green-400"
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
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    {formSettings.successMessage ||
                      "Thank you! Your message has been sent successfully."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    {formSettings.errorMessage ||
                      "Sorry, there was an error sending your message. Please try again."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Editing Placeholder */}
        {isEditing && fields.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              Click to configure form fields
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
