"use client";

import React from "react";
import { Download, FileText } from "lucide-react";
import { H5, P } from "../ui/typography";

interface DownloadFrameworkProps {
  title?: string;
  description?: string;
  downloadUrl?: string;
  fileName?: string;
}

export const DownloadFramework: React.FC<DownloadFrameworkProps> = ({
  title = "Our Grantmaking Framework",
  description = "We outline what Turning Tides funds and doesn't fund, always linked to pathways toward tenure security. These priorities guide groups in deciding if partnership is a good fit.",
  downloadUrl = "#",
  fileName = "grantmaking-framework.pdf",
}) => {
  const handleDownload = () => {
    if (downloadUrl && downloadUrl !== "#") {
      // Create a temporary link element to trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-[#2B46A8] py-10 sm:pt-[46px]">
      <div className="container flex items-center justify-between gap-32 mx-auto">
        <div className="flex items-center justify-start gap-8">
          {/* Left side - PDF Icon */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
              <div className="w-[60px] h-[60px] bg-orange-500 rounded-lg flex flex-col items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
                <span className="text-white text-xs font-medium">PDF</span>
              </div>
            </div>
          </div>

          {/* Center - Content */}
          <div className="flex-1 space-y-3">
            <H5 style="h5bold" className="text-white">
              {title}
            </H5>
            <P style="p1reg" className="text-white/80">
              {description}
            </P>
          </div>
        </div>

        {/* Right side - Download Button */}
        <div className="flex flex-col gap-8 items-center justify-center shrink-0">
          <button
            onClick={handleDownload}
            className="bg-white text-[#060726] px-14 py-5 rounded flex items-center space-x-4 hover:bg-gray-100 transition-colors duration-200 font-normal text-base leading-[150%] tracking-normal"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          <button className="text-white text-base font-normal">
            What We Support ?
          </button>
        </div>
      </div>
    </div>
  );
};
