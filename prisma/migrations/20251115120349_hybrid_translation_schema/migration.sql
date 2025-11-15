/*
  Warnings:

  - You are about to drop the column `content` on the `article_translations` table. All the data in the column will be lost.
  - You are about to drop the column `altText` on the `page_section_translations` table. All the data in the column will be lost.
  - You are about to drop the column `caption` on the `page_section_translations` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `page_section_translations` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `page_section_translations` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `page_translations` table. All the data in the column will be lost.
  - You are about to drop the column `template` on the `pages` table. All the data in the column will be lost.
  - You are about to drop the `site_content_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `site_contents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `template_reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `templates` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[articleId,slug]` on the table `article_translations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pageId,slug]` on the table `page_translations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pageType,slug]` on the table `pages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `page_sections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `site_content_translations` DROP FOREIGN KEY `site_content_translations_contentId_fkey`;

-- DropForeignKey
ALTER TABLE `site_content_translations` DROP FOREIGN KEY `site_content_translations_languageId_fkey`;

-- DropForeignKey
ALTER TABLE `template_reviews` DROP FOREIGN KEY `template_reviews_templateId_fkey`;

-- DropForeignKey
ALTER TABLE `template_reviews` DROP FOREIGN KEY `template_reviews_userId_fkey`;

-- DropForeignKey
ALTER TABLE `templates` DROP FOREIGN KEY `templates_authorId_fkey`;

-- AlterTable
ALTER TABLE `article_translations` DROP COLUMN `content`,
    ADD COLUMN `slug` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `articles` ADD COLUMN `content` LONGTEXT NOT NULL,
    ADD COLUMN `excerpt` TEXT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `menu_items` ADD COLUMN `badgeStyle` VARCHAR(191) NULL,
    ADD COLUMN `badgeText` VARCHAR(191) NULL,
    ADD COLUMN `customStyle` VARCHAR(191) NULL,
    ADD COLUMN `iconClass` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `menus` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `page_section_translations` DROP COLUMN `altText`,
    DROP COLUMN `caption`,
    DROP COLUMN `content`,
    DROP COLUMN `metadata`;

-- AlterTable
ALTER TABLE `page_sections` ADD COLUMN `content` LONGTEXT NOT NULL,
    ADD COLUMN `subtitle` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(191) NULL,
    MODIFY `type` ENUM('CONTAINER', 'GRID', 'FLEXBOX', 'COLUMNS', 'HERO', 'RICH_TEXT', 'IMAGE', 'IMAGE_GALLERY', 'VIDEO_EMBED', 'SLIDER_CAROUSEL', 'CONTACT_FORM', 'SUBSCRIPTION_FORM', 'ACCORDION', 'TABS', 'MODAL_TRIGGER', 'BUTTON_GROUP', 'ARTICLE_LIST', 'CATEGORY_SHOWCASE', 'FEATURED_CONTENT', 'SEARCH_INTERFACE', 'TESTIMONIALS', 'TEAM_SHOWCASE', 'SOCIAL_FEED', 'COUNTDOWN', 'PRICING_TABLE', 'TIMELINE', 'STATS_COUNTER', 'PROGRESS_BAR', 'CHART_DISPLAY', 'MAP_EMBED', 'CUSTOM_HTML', 'EMBED_CODE', 'WIDGET_AREA', 'SPACER', 'NAVIGATION_BLOCK', 'BREADCRUMB_BLOCK', 'PAGINATION_BLOCK', 'SIDEBAR_BLOCK', 'CTA_BLOCK', 'FOOTER_BLOCK', 'DOCUMENT_LIST') NOT NULL;

-- AlterTable
ALTER TABLE `page_translations` DROP COLUMN `content`,
    ADD COLUMN `slug` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pages` DROP COLUMN `template`,
    ADD COLUMN `pageType` ENUM('HOME', 'ABOUT_US', 'OUR_WORK', 'GOVERNANCE', 'STORIES', 'GET_INVOLVED', 'CUSTOM') NOT NULL DEFAULT 'CUSTOM',
    MODIFY `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'PUBLISHED';

-- DropTable
DROP TABLE `site_content_translations`;

-- DropTable
DROP TABLE `site_contents`;

-- DropTable
DROP TABLE `template_reviews`;

-- DropTable
DROP TABLE `templates`;

-- CreateTable
CREATE TABLE `page_contents` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` LONGTEXT NOT NULL,
    `type` ENUM('TEXT', 'HTML', 'RICH_TEXT', 'JSON', 'IMAGE', 'VIDEO', 'LINK', 'NUMBER', 'BOOLEAN', 'DATE', 'ARRAY', 'OBJECT') NOT NULL DEFAULT 'TEXT',
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `description` VARCHAR(191) NULL,
    `isRequired` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `pageTranslationId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `page_contents_pageTranslationId_key_key`(`pageTranslationId`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `page_analytics` (
    `id` VARCHAR(191) NOT NULL,
    `pageId` VARCHAR(191) NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `uniqueViews` INTEGER NOT NULL DEFAULT 0,
    `bounceRate` DOUBLE NULL,
    `avgTimeOnPage` INTEGER NULL,
    `loadTime` DOUBLE NULL,
    `coreWebVitals` TEXT NULL,
    `conversions` INTEGER NOT NULL DEFAULT 0,
    `conversionRate` DOUBLE NULL,
    `date` DATETIME(3) NOT NULL,
    `breakdown` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `page_analytics_pageId_date_key`(`pageId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `article_translations_articleId_slug_key` ON `article_translations`(`articleId`, `slug`);

-- CreateIndex
CREATE UNIQUE INDEX `page_translations_pageId_slug_key` ON `page_translations`(`pageId`, `slug`);

-- CreateIndex
CREATE UNIQUE INDEX `pages_pageType_slug_key` ON `pages`(`pageType`, `slug`);

-- AddForeignKey
ALTER TABLE `page_contents` ADD CONSTRAINT `page_contents_pageTranslationId_fkey` FOREIGN KEY (`pageTranslationId`) REFERENCES `page_translations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `page_analytics` ADD CONSTRAINT `page_analytics_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `pages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
