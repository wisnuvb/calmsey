-- CreateTable
CREATE TABLE `resource_download_submissions` (
    `id` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(500) NOT NULL,
    `email` VARCHAR(320) NOT NULL,
    `countryCode` VARCHAR(16) NOT NULL,
    `countryLabel` VARCHAR(200) NOT NULL,
    `modalSource` VARCHAR(32) NOT NULL,
    `documentItemId` VARCHAR(128) NULL,
    `documentTitle` TEXT NULL,
    `selectorType` VARCHAR(16) NOT NULL,
    `selectedOptionLabel` VARCHAR(500) NOT NULL,
    `fileUrl` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `resource_download_submissions_createdAt_idx`(`createdAt`),
    INDEX `resource_download_submissions_email_idx`(`email`),
    INDEX `resource_download_submissions_modalSource_idx`(`modalSource`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
