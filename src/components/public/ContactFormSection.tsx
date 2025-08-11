/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

interface ContactFormSectionProps {
  translation: any;
  style?: React.CSSProperties;
}

export default function ContactFormSection({
  translation,
  style,
}: ContactFormSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const metadata = translation?.metadata || {};
  const fields = metadata.fields || [
    { type: "text", label: "Name", required: true, key: "name" },
    { type: "email", label: "Email", required: true, key: "email" },
    { type: "textarea", label: "Message", required: true, key: "message" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="py-12" style={style}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              {metadata.successMessage || "Thank you for your message!"}
            </h3>
            <p className="text-green-600">
              We&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12" style={style}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {translation?.title && (
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            {translation.title}
          </h2>
        )}

        {translation?.subtitle && (
          <p className="text-lg text-gray-600 text-center mb-8">
            {translation.subtitle}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field: any, index: number) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  required={field.required}
                  value={formData[field.key as keyof typeof formData] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  type={field.type}
                  required={field.required}
                  value={formData[field.key as keyof typeof formData] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}

          {error && (
            <div className="bg-red-50 border border-red-300 rounded-md p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Sending..." : metadata.submitText || "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
