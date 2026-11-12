-- CreateIndex
CREATE INDEX `articles_status_publishedAt_idx` ON `articles`(`status`, `publishedAt`);

-- CreateIndex
CREATE INDEX `media_createdAt_idx` ON `media`(`createdAt`);

-- CreateIndex
CREATE INDEX `contact_submissions_status_createdAt_idx` ON `contact_submissions`(`status`, `createdAt`);

-- CreateIndex
CREATE INDEX `contact_submissions_createdAt_idx` ON `contact_submissions`(`createdAt`);

-- CreateIndex
CREATE INDEX `contact_submissions_email_createdAt_idx` ON `contact_submissions`(`email`, `createdAt`);
