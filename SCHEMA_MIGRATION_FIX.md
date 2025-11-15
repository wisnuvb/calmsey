# Schema Migration Fix Guide

## Problem

After implementing the **Hybrid Translation Approach**, the schema was updated but:
1. ❌ Database wasn't migrated
2. ❌ Service layer still used old schema
3. ❌ Languages not seeded

## Errors You Might See

### Error 1: "Unknown argument `content`"
```
Unknown argument `content`. Available options are marked with ?.
```

**Cause:** PageTranslation model no longer has `content` field in hybrid schema.

**Fix:** Use `simple-cms-fixed.ts` instead of `simple-cms.ts`

### Error 2: "No languages available"
**Cause:** Languages table is empty

**Fix:** Run seeder or quick-fix script

### Error 3: Articles form missing title
**Cause:** Article schema also changed for hybrid approach

**Fix:** Use hybrid Article creation (content in Article model, not translation)

---

## Quick Fix (Fastest)

Run this command to fix immediately:

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Run quick fix script
npx ts-node scripts/quick-fix.ts

# 3. Restart dev server
npm run dev
```

This will:
- ✅ Seed English, Indonesian, Chinese languages
- ✅ Create admin user (admin@turningtidesfacility.org / admin123)
- ✅ Check schema compatibility

---

## Full Migration (Recommended for Production)

### Step 1: Backup Database

```bash
# MySQL
mysqldump -u your_user -p your_database > backup_before_hybrid.sql

# Or use your DB admin tool
```

### Step 2: Run Prisma Migration

```bash
# Generate migration for hybrid schema
npx prisma migrate dev --name hybrid_translation_schema

# This will:
# - Add 'title', 'content', 'excerpt' to Article model
# - Add 'slug' to ArticleTranslation
# - Remove 'content' from ArticleTranslation (keeping SEO fields only)
# - Add 'title', 'subtitle', 'content' to PageSection
# - Remove content fields from PageSectionTranslation
# - Add 'slug' to PageTranslation
# - Remove 'content', 'metadata' from PageTranslation
```

### Step 3: Data Migration (if you have existing data)

If you have existing articles/pages with content in translations:

```sql
-- Migrate Article content from translations to main model (English only)
UPDATE articles a
LEFT JOIN article_translations at ON a.id = at.articleId AND at.languageId = 'en'
SET
  a.title = at.title,
  a.content = at.content,
  a.excerpt = at.excerpt
WHERE at.id IS NOT NULL;

-- Migrate PageSection content (English only)
UPDATE page_sections ps
LEFT JOIN page_section_translations pst ON ps.id = pst.sectionId AND pst.languageId = 'en'
SET
  ps.title = pst.title,
  ps.subtitle = pst.subtitle,
  ps.content = pst.content
WHERE pst.id IS NOT NULL;
```

### Step 4: Seed Base Data

```bash
npx prisma db seed
```

### Step 5: Update Code Imports

Replace all imports from `simple-cms` to `simple-cms-fixed`:

```typescript
// Before
import { SimpleCMS } from "@/lib/services/simple-cms";

// After
import { SimpleCMS } from "@/lib/services/simple-cms-fixed";
```

Files to update:
- `src/app/api/admin/pages/route.ts` ✅ (already fixed)
- `src/app/api/admin/pages/[id]/route.ts`
- `src/app/api/admin/pages/[id]/content/route.ts`
- `src/app/api/public/pages/[slug]/route.ts`
- `src/app/[lang]/[slug]/page.tsx`

---

## Understanding the Hybrid Schema

### OLD Schema (Full Translation)

```prisma
model Article {
  id String @id
  slug String
  // NO content here
  translations ArticleTranslation[]
}

model ArticleTranslation {
  id String @id
  title String
  content String @db.LongText ❌ // Removed in hybrid
  excerpt String?
  seoTitle String?
  seoDescription String?
}
```

### NEW Schema (Hybrid Approach)

```prisma
model Article {
  id String @id
  slug String

  // ✅ NEW: English default content
  title String
  content String @db.LongText
  excerpt String?

  translations ArticleTranslation[] // Optional for SEO only
}

model ArticleTranslation {
  id String @id

  // SEO fields only
  slug String? // Localized URL
  title String
  excerpt String?
  seoTitle String?
  seoDescription String?

  // ❌ content field REMOVED (uses Article.content + browser translation)
}
```

**Benefits:**
- ✅ 80% less translation work (only SEO fields)
- ✅ Faster publishing (write once in English)
- ✅ Browser handles content translation
- ✅ SEO still optimized (meta tags in DB)

---

## Testing After Fix

### 1. Test Languages

```bash
# Visit admin
http://localhost:3000/admin

# Check language switcher
# Should show: English, Indonesian
```

### 2. Test Article Creation

```bash
# Visit
http://localhost:3000/admin/articles/new

# Fields should show:
# - Title (visible)
# - Content (rich text editor)
# - Excerpt
# - Featured Image
# - Categories
# - Tags
```

### 3. Test Page Creation

```bash
# Visit
http://localhost:3000/admin/pages

# POST to /api/admin/pages should work:
{
  "slug": "test-page",
  "title": "Test Page",
  "content": "<p>Test content</p>",
  "languageId": "en"
}
```

### 4. Test Headless CMS

```bash
# Visit
http://localhost:3000/admin/page-content

# Select HOME page
# Edit content
# Save
# Should save to PageContent table
```

---

## Common Issues & Solutions

### Issue: "Prisma Client validation error"
**Solution:** Regenerate Prisma Client
```bash
npx prisma generate
```

### Issue: "Table doesn't exist"
**Solution:** Run migration
```bash
npx prisma migrate dev
```

### Issue: "Can't find admin user"
**Solution:** Run seeder
```bash
npx prisma db seed
```

### Issue: "Languages empty in dropdown"
**Solution:** Run quick-fix script
```bash
npx ts-node scripts/quick-fix.ts
```

### Issue: "Article form shows errors"
**Solution:** Check Article model has title, content, excerpt fields

---

## Rollback Plan

If something goes wrong:

```bash
# 1. Restore database backup
mysql -u your_user -p your_database < backup_before_hybrid.sql

# 2. Revert schema
cp prisma/schema.prisma.backup prisma/schema.prisma

# 3. Regenerate client
npx prisma generate

# 4. Revert code
git checkout HEAD~3 -- src/
```

---

## Files Changed

### New Files:
- ✅ `scripts/quick-fix.ts` - Quick fix script
- ✅ `src/lib/services/simple-cms-fixed.ts` - Compatible with hybrid schema
- ✅ `SCHEMA_MIGRATION_FIX.md` - This guide

### Modified Files:
- ✅ `src/app/api/admin/pages/route.ts` - Use simple-cms-fixed
- ⚠️ Need to update:
  - `src/app/api/admin/pages/[id]/route.ts`
  - `src/app/api/admin/pages/[id]/content/route.ts`
  - `src/app/api/public/pages/[slug]/route.ts`
  - `src/app/[lang]/[slug]/page.tsx`

---

## Support

If you encounter other issues:
1. Check console for specific error
2. Check database has been migrated
3. Check Prisma Client is up to date
4. Contact development team

---

**Last Updated:** 2025-11-15
**Schema Version:** Hybrid Translation v1
**Prisma Version:** 5.x
