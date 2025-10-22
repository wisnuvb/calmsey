"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import { Pagination } from "../common";

interface Article {
  id: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  link: string;
  publishedAt: string;
}

interface ArticlesSectionProps {
  title?: string;
  articles?: Article[];
  sortOptions?: string[];
  currentSort?: string;
  onSortChange?: (sort: string) => void;
  backgroundColor?: string;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  title = "All articles",
  articles = [
    {
      id: "1",
      image: "/assets/articles/indonesia-coast.jpg",
      imageAlt: "People walking on a dirt path under a large tree",
      title:
        "Going into hak: Pathways for revitalizing marine tenure rights...",
      description:
        "The Indonesian archipelago stretches over 3000 miles including the heart of the Coral Triangle, an area known as the center of global marine...",
      link: "/articles/indonesia-marine-tenure",
      publishedAt: "2024-01-15",
    },
    {
      id: "2",
      image: "/assets/articles/fishing-net.jpg",
      imageAlt: "Person in traditional clothing pulling fishing net from ocean",
      title: "From the forest to the sea: uniting for tenure rights",
      description:
        "Tenure Facility is excited to announce its partnership with Turning Tides, a newly established initiative dedicated to protecting...",
      link: "/articles/forest-to-sea-tenure",
      publishedAt: "2024-01-10",
    },
    {
      id: "3",
      image: "/assets/articles/weaving-baskets.jpg",
      imageAlt: "People engaged in crafting and weaving baskets",
      title:
        "Traditional marine tenure: A basis for artisanal fisheries managem...",
      description:
        "There has been increasing interest in using traditional forms of marine resource ownership as models for fisheries management regimes t...",
      link: "/articles/traditional-marine-tenure",
      publishedAt: "2024-01-05",
    },
    {
      id: "4",
      image: "/assets/articles/wooden-boats.jpg",
      imageAlt: "Wooden boats docked next to stilt house",
      title:
        "Going into hak: Pathways for revitalizing marine tenure rights...",
      description:
        "The Indonesian archipelago stretches over 3000 miles including the heart of the Coral Triangle, an area known as the center of global marine...",
      link: "/articles/indonesia-marine-tenure-2",
      publishedAt: "2024-01-01",
    },
    {
      id: "5",
      image: "/assets/articles/fresh-fish.jpg",
      imageAlt: "Fresh fish piled on metal trays at market",
      title: "Common Property Models of Sea Tenure: A Case Study from the...",
      description:
        "In recent decades, Pacific Region indigenous sea tenure regimes have received considerable attention from social scientists who believe th...",
      link: "/articles/pacific-sea-tenure",
      publishedAt: "2023-12-28",
    },
    {
      id: "6",
      image: "/assets/articles/fishing-boats.jpg",
      imageAlt: "Brightly painted wooden fishing boats on sandy shore",
      title: "From the forest to the sea: uniting for tenure rights",
      description:
        "Tenure Facility is excited to announce its partnership with Turning Tides, a newly established initiative dedicated to protecting...",
      link: "/articles/forest-to-sea-tenure-2",
      publishedAt: "2023-12-25",
    },
  ],
  sortOptions = ["Latest", "Oldest", "Most Popular", "A-Z"],
  currentSort = "Latest",
  onSortChange,
  backgroundColor = "bg-white",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSort, setSelectedSort] = useState(currentSort);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const articlesPerPage = 4;
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setShowSortDropdown(false);
    if (onSortChange) {
      onSortChange(sort);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className={`w-full ${backgroundColor} py-16 md:py-24`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-0">
            {title}
          </h2>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="text-gray-700">{selectedSort}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-200 ${
                      option === selectedSort
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentArticles.map((article) => (
            <ArticleCard
              key={article.id}
              image={article.image}
              imageAlt={article.imageAlt}
              title={article.title}
              description={article.description}
              link={article.link}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};
