/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React from "react";

interface TestimonialsSectionProps {
  translation: any;
  style?: React.CSSProperties;
}

export default function TestimonialsSection({
  translation,
  style,
}: TestimonialsSectionProps) {
  const metadata = translation?.metadata || {};
  const testimonials = metadata.testimonials || [];

  return (
    <section className="py-16 bg-gray-50" style={style}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {translation?.title && (
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {translation.title}
          </h2>
        )}

        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial: any, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < (testimonial.rating || 5)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-gray-700 mb-4">
                  &quot;{testimonial.quote}&quot;
                </blockquote>

                <div className="flex items-center">
                  {testimonial.avatar && (
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full mr-3"
                      width={100}
                      height={100}
                    />
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    {testimonial.title && (
                      <div className="text-sm text-gray-600">
                        {testimonial.title}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>No testimonials configured</p>
          </div>
        )}
      </div>
    </section>
  );
}
