-- CreateTable
CREATE TABLE `footer_brand` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'singleton',
    `mainLogoSrc` VARCHAR(191) NOT NULL DEFAULT '/assets/Logo-white.png',
    `mainLogoAlt` VARCHAR(191) NOT NULL DEFAULT 'Turning Tides Logo',
    `mainLogoHref` VARCHAR(191) NOT NULL DEFAULT '/',
    `sponsorLogoSrc` VARCHAR(191) NOT NULL DEFAULT '/assets/Logo-TenureFacility.png',
    `sponsorLogoAlt` VARCHAR(191) NOT NULL DEFAULT 'Tenure Facility Logo',
    `sponsorshipParagraph` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `footer_brand` (
    `id`,
    `mainLogoSrc`,
    `mainLogoAlt`,
    `mainLogoHref`,
    `sponsorLogoSrc`,
    `sponsorLogoAlt`,
    `sponsorshipParagraph`,
    `createdAt`,
    `updatedAt`
)
VALUES (
    'singleton',
    '/assets/Logo-white.png',
    'Turning Tides Logo',
    '/',
    '/assets/Logo-TenureFacility.png',
    'Tenure Facility Logo',
    'Turning Tides is a fiscally sponsored project of the Tenure Facility Fund, a US 501(c)3, which is a Not-for-profit subsidiary of the International Land and Forest Tenure Facility.',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
);
