-- AlterTable: make lead-form PII columns optional for anonymous download tracking
ALTER TABLE `resource_download_submissions` MODIFY `fullName` VARCHAR(500) NULL;
ALTER TABLE `resource_download_submissions` MODIFY `email` VARCHAR(320) NULL;
ALTER TABLE `resource_download_submissions` MODIFY `countryCode` VARCHAR(16) NULL;
ALTER TABLE `resource_download_submissions` MODIFY `countryLabel` VARCHAR(200) NULL;
