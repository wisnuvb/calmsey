/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { PageTemplate, PageStatus } from "@prisma/client";

export interface SiteSetupStatus {
  dbConnected: boolean;
  adminExists: boolean;
  settingsConfigured: boolean;
  landingPageExists: boolean;
  isSetupComplete: boolean;
  error?: string;
}

export async function getSiteSetupStatus(): Promise<SiteSetupStatus> {
  try {
    // Check if database is accessible
    await prisma.$queryRaw`SELECT 1`;

    // Check if admin user exists
    const adminExists = await prisma.user.findFirst({
      where: { role: "SUPER_ADMIN" },
    });

    // Check if basic settings exist
    const settingsCount = await prisma.siteSetting.count();

    // Check if homepage/landing page exists
    const landingPage = await prisma.page.findFirst({
      where: {
        template: PageTemplate.LANDING,
        status: PageStatus.PUBLISHED,
      },
    });

    const isSetupComplete = !!adminExists && settingsCount > 0 && !!landingPage;

    return {
      dbConnected: true,
      adminExists: !!adminExists,
      settingsConfigured: settingsCount > 0,
      landingPageExists: !!landingPage,
      isSetupComplete,
    };
  } catch (error) {
    return {
      dbConnected: false,
      adminExists: false,
      settingsConfigured: false,
      landingPageExists: false,
      isSetupComplete: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
}

export async function getPageByTemplate(template: string, language: string) {
  try {
    const page = await prisma.page.findFirst({
      where: {
        template: template as PageTemplate,
        status: PageStatus.PUBLISHED,
      },
      include: {
        translations: {
          where: { languageId: language },
        },
        sections: {
          where: { isActive: true },
          include: {
            translations: {
              where: { languageId: language },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    return page;
  } catch (error) {
    console.error("Error fetching page by template:", error);
    return null;
  }
}

export async function createDefaultAdminUser(userData: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const admin = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        emailVerified: new Date(),
      },
    });

    return admin;
  } catch (error) {
    throw new Error(
      `Failed to create admin user: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function createDefaultSettings() {
  try {
    const defaultSettings = [
      { key: "site_name", value: "Turning Tides Facility", type: "TEXT" },
      {
        key: "site_tagline",
        value: "Premier rehabilitation and treatment facility",
        type: "TEXT",
      },
      {
        key: "site_description",
        value:
          "A comprehensive rehabilitation facility providing expert care and support for recovery.",
        type: "TEXT",
      },
      { key: "contact_phone", value: "+1-555-0123", type: "TEXT" },
      {
        key: "contact_email",
        value: "info@turningtidesfacility.org",
        type: "TEXT",
      },
      {
        key: "address",
        value: "123 Recovery Lane, Hope City, HC 12345",
        type: "TEXT",
      },
    ];

    await prisma.siteSetting.createMany({
      data: defaultSettings as any[],
      skipDuplicates: true,
    });

    return true;
  } catch (error) {
    throw new Error(
      `Failed to create default settings: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
