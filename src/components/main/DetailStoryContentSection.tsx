"use client";

import {
  MapPin,
  Play,
  Share2,
  Link as LinkIcon,
  ArrowUpRight,
} from "lucide-react";
import { H2, H3, H5, P } from "../ui/typography";
import { cn, getImageUrl } from "@/lib/utils";
import Image from "next/image";

interface PartnerOrganization {
  name: string;
  logo: string;
  fullName: string;
}

interface Photo {
  id: string;
  src: string;
  alt: string;
}

interface RelatedArticle {
  id: string;
  title: string;
  url: string;
}

interface DetailStoryContentSectionProps {
  partnerOrganization: PartnerOrganization;
  country: string;
  description: string;
  photos: Photo[];
  relatedArticles: RelatedArticle[];
  className?: string;
}

export function DetailStoryContentSection({
  partnerOrganization,
  country,
  description,
  photos,
  relatedArticles,
  className,
}: DetailStoryContentSectionProps) {
  return (
    <section className={cn("py-16 bg-white", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Partner Organization */}
              <div className="bg-[gray-50] border border-[#D7E4EF] p-6 sm:p-11 rounded-lg">
                <div className="space-y-3">
                  <H3
                    style="h5bold"
                    className="text-[#010107] font-semibold text-xs leading-[15.] tracking-normal uppercase"
                  >
                    Partner Organization
                  </H3>
                  <Image
                    src={getImageUrl(partnerOrganization.logo)}
                    alt={partnerOrganization.name}
                    width={128}
                    height={128}
                    className="rounded"
                  />
                  <p className="font-work-sans font-normal text-base text-[#06072680]">
                    {partnerOrganization.name}
                  </p>
                </div>

                <div className="border-b border-[#C3D7E8] my-11" />

                <H3
                  style="h5bold"
                  className="text-[#010107] mb-3 tracking-wide text-base font-normal font-work-sans"
                >
                  Country
                </H3>
                <div className="flex items-center space-x-2 text-[#010107]">
                  <MapPin className="w-5 h-5" />
                  <span className="font-work-sans text-xl font-bold leading-[1.4]">
                    {country}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-5 border border-[#CADBEA] text-[#010107] rounded-lg hover:bg-gray-50 transition-colors">
                  <Play className="w-4 h-4" />
                  <span className="font-work-sans font-medium">Trailer</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-5 bg-[#06020C] text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="font-work-sans font-medium">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <H5
                style="h5bold"
                className="text-[#010107] font-nunito-sans mb-6"
              >
                Description
              </H5>
              <P style="p1reg" className="text-[#060726CC] leading-relaxed">
                {description}
              </P>
            </div>

            {/* Photos */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <H2
                  style="h3semibold"
                  className="text-[#010107] flex items-center gap-3"
                >
                  Photos{" "}
                  <span className="text-[#06072680]">({photos.length})</span>
                </H2>
                <button className="text-[#010107] text-sm font-nunito-sans font-normal border border-[#CADBEA] py-4 px-6 rounded">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.slice(0, 6).map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <Image
                      src={getImageUrl(photo.src)}
                      alt={photo.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Related Articles */}
            <div>
              <H5 style="h5bold" className="text-[#010107] mb-6">
                Related articles about this story
              </H5>
              <div className="space-y-4">
                {relatedArticles.map((article) => (
                  <a
                    key={article.id}
                    href={article.url}
                    className="block py-4 px-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group bg-[#F1F5F9]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <LinkIcon className="w-4 h-4 text-[#3C62ED] group-hover:text-blue-600" />
                        <P
                          style="p1reg"
                          className="text-[#060726CC] group-hover:text-blue-600"
                        >
                          {article.title}
                        </P>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#3C62ED] group-hover:text-blue-600" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
