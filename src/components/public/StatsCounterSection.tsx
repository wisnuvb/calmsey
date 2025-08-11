/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";

interface StatsCounterSectionProps {
  translation: any;
  style?: React.CSSProperties;
}

export default function StatsCounterSection({
  translation,
  style,
}: StatsCounterSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const metadata = translation?.metadata || {};
  const stats = metadata.stats || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-blue-600 text-white"
      style={style}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {translation?.title && (
          <h2 className="text-3xl font-bold text-center mb-12">
            {translation.title}
          </h2>
        )}

        {stats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat: any, index: number) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">
                  <CountUpNumber
                    end={stat.value || 0}
                    duration={2000}
                    start={isVisible}
                    suffix={stat.suffix || ""}
                    prefix={stat.prefix || ""}
                  />
                </div>
                <div className="text-lg font-medium">{stat.label}</div>
                {stat.description && (
                  <div className="text-sm text-blue-100 mt-1">
                    {stat.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-blue-100">
            <p>No statistics configured</p>
          </div>
        )}
      </div>
    </section>
  );
}

// Count up animation component
function CountUpNumber({
  end,
  duration,
  start,
  suffix = "",
  prefix = "",
}: {
  end: number;
  duration: number;
  start: boolean;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [start, end, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
