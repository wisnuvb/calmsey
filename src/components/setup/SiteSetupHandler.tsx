"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { SiteSetupStatus } from "@/lib/site-setup";
import DatabaseConnectionError from "./DatabaseConnectionError";
import SiteUnderDevelopment from "./SiteUnderDevelopment";
import AdminSetupWizard from "./AdminSetupWizard";
import SiteSettingsSetup from "./SiteSettingsSetup";
import CreateLandingPagePrompt from "./CreateLandingPagePrompt";

interface SiteSetupHandlerProps {
  setupStatus: SiteSetupStatus;
  language: string;
}

export default function SiteSetupHandler({
  setupStatus,
  language,
}: SiteSetupHandlerProps) {
  const { data: session, status } = useSession();

  if (!setupStatus.dbConnected) {
    return <DatabaseConnectionError error={setupStatus.error} />;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session?.user) {
    return <SiteUnderDevelopment language={language} />;
  }

  if (!setupStatus.adminExists) {
    return <AdminSetupWizard onComplete={() => window.location.reload()} />;
  }

  if (!setupStatus.settingsConfigured) {
    return <SiteSettingsSetup onComplete={() => window.location.reload()} />;
  }

  if (!setupStatus.landingPageExists) {
    return <CreateLandingPagePrompt language={language} />;
  }

  return null;
}
