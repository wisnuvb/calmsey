# Hybrid Translation Migration Guide

## Overview

This migration implements a **Hybrid Translation Approach** where:
- ✅ **English content** is stored in the main models (Article, PageSection)
- ✅ **SEO-critical fields** are stored in translation models (title, excerpt, meta tags, URL slug)
- ✅ **Content body** uses browser translation (auto + Google Translate fallback)
- ✅ **Translations are optional** - fallback to English if not available

## Benefits

- 🚀 **80% less translation work** - Only translate SEO fields
- 💰 **Lower cost** - No need to translate full content
- ⚡ **Faster publishing** - Write in English, auto-translate for other languages
- 🎯 **SEO-friendly** - Meta tags still optimized per language
- 🔄 **Flexible** - Can still add manual translations when needed

---

## Schema Changes

### 1. Article Model

**BEFORE:**
```prisma
model Article {
  id            String        @id @default(cuid())
  slug          String        @unique
  status        ArticleStatus @default(DRAFT)
  featuredImage String?
  publishedAt   DateTime?
  // No content here
}

model ArticleTranslation {
  id             String   @id @default(cuid())
  title          String
  content        String   @db.LongText  // ❌ REMOVED
  excerpt        String?  @db.Text
  seoTitle       String?
  seoDescription String?  @db.Text
}
```

**AFTER:**
```prisma
model Article {
  id            String        @id @default(cuid())
  slug          String        @unique

  // ✅ NEW: English default content
  title         String
  content       String        @db.LongText
  excerpt       String?       @db.Text

  status        ArticleStatus @default(DRAFT)
  featuredImage String?
  publishedAt   DateTime?
}

model ArticleTranslation {
  id             String   @id @default(cuid())

  // ✅ SEO fields only
  slug           String?  // Localized URL
  title          String
  excerpt        String?  @db.Text
  seoTitle       String?
  seoDescription String?  @db.Text

  // ❌ content field REMOVED (uses Article.content with browser translation)
}
```

### 2. PageSection Model

**BEFORE:**
```prisma
model PageSection {
  id       String          @id @default(cuid())
  type     PageSectionType
  order    Int             @default(0)
  // No content here
}

model PageSectionTranslation {
  id       String   @id @default(cuid())
  title    String?
  subtitle String?
  content  String   @db.LongText  // ❌ REMOVED
  metadata String?  @db.LongText  // ❌ REMOVED
  altText  String?  // ❌ REMOVED
  caption  String?  // ❌ REMOVED
}
```

**AFTER:**
```prisma
model PageSection {
  id       String          @id @default(cuid())
  type     PageSectionType
  order    Int             @default(0)

  // ✅ NEW: English default content
  title    String?
  subtitle String?
  content  String  @db.LongText
}

model PageSectionTranslation {
  id       String   @id @default(cuid())

  // ✅ Navigation fields only
  title    String?  // For TOC/navigation
  subtitle String?

  // ❌ content, metadata, altText, caption REMOVED
}
```

### 3. PageTranslation Model

**BEFORE:**
```prisma
model PageTranslation {
  id             String   @id @default(cuid())
  title          String
  excerpt        String?  @db.Text
  seoTitle       String?
  seoDescription String?  @db.Text
  content        String   @db.LongText  // ❌ REMOVED
  metadata       String?  @db.LongText  // ❌ REMOVED
}
```

**AFTER:**
```prisma
model PageTranslation {
  id             String   @id @default(cuid())

  // ✅ SEO fields only
  slug           String?  // Localized URL
  title          String
  excerpt        String?  @db.Text
  seoTitle       String?
  seoDescription String?  @db.Text

  // ❌ content, metadata REMOVED
}
```

---

## Migration Steps

### Step 1: Database Migration

**⚠️ IMPORTANT: Backup your database first!**

```bash
# Backup database
mysqldump -u your_user -p your_database > backup_$(date +%Y%m%d).sql

# Generate Prisma migration
npx prisma migrate dev --name hybrid_translation_approach

# This will:
# 1. Add title, content, excerpt to Article model
# 2. Add slug to ArticleTranslation
# 3. Drop content column from ArticleTranslation
# 4. Add title, subtitle, content to PageSection
# 5. Drop content, metadata, altText, caption from PageSectionTranslation
# 6. Add slug to PageTranslation
# 7. Drop content, metadata from PageTranslation
```

### Step 2: Data Migration

After schema migration, you need to migrate existing data:

```sql
-- Migrate Article content from translations to main table
UPDATE articles a
LEFT JOIN article_translations at ON a.id = at.articleId AND at.languageId = 'en'
SET
  a.title = at.title,
  a.content = at.content,
  a.excerpt = at.excerpt
WHERE at.id IS NOT NULL;

-- Migrate PageSection content from translations to main table
UPDATE page_sections ps
LEFT JOIN page_section_translations pst ON ps.id = pst.sectionId AND pst.languageId = 'en'
SET
  ps.title = pst.title,
  ps.subtitle = pst.subtitle,
  ps.content = pst.content
WHERE pst.id IS NOT NULL;

-- Note: After migration, non-English translations will lose content
-- but keep SEO fields (title, excerpt, meta tags)
```

### Step 3: Update Code

See implementation files:
- `src/components/public/LanguageSwitcher.tsx` - Enhanced with browser translation
- `src/lib/translate.ts` - Google Translate integration
- `src/lib/public-api.ts` - Updated API to handle hybrid content

---

## How It Works

### Content Flow

```
┌─────────────────────────────────────────────┐
│  User visits: /id/articles/coastal-protection│
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  1. API checks: ArticleTranslation for "id"  │
│     - Found? Use translated SEO fields       │
│     - Not found? Use English SEO fields      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  2. Content: ALWAYS from Article.content     │
│     (English)                                │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  3. Frontend: Set <html lang="id">           │
│     - Browser auto-translate (if enabled)    │
│     - Google Translate fallback              │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  4. SEO: Uses translated meta tags           │
│     <title>{translatedSeoTitle}</title>      │
│     <meta description="{translated}" />      │
└─────────────────────────────────────────────┘
```

### Example API Response

**Request:** `GET /api/public/articles/coastal-protection?lang=id`

**Response:**
```json
{
  "article": {
    "id": "abc123",
    "slug": "perlindungan-pesisir",  // From ArticleTranslation
    "title": "Perlindungan Pesisir",  // From ArticleTranslation
    "content": "Coastal areas are...",  // ⚡ English from Article (browser translates)
    "excerpt": "Wilayah pesisir adalah...",  // From ArticleTranslation
    "seoTitle": "Perlindungan Pesisir Indonesia",  // From ArticleTranslation
    "seoDescription": "Panduan lengkap...",  // From ArticleTranslation
    "isTranslated": true,
    "contentLanguage": "en"  // Indicator that content is in English
  }
}
```

---

## Admin Workflow

### Publishing an Article

**BEFORE (Full Translation):**
1. Write article in English ✍️
2. Translate title, content, excerpt to Indonesian ✍️
3. Translate title, content, excerpt to Chinese ✍️
4. Translate SEO fields for all languages ✍️
5. Publish (4-6 hours of work)

**AFTER (Hybrid Translation):**
1. Write article in English ✍️
2. *(Optional)* Translate SEO fields to Indonesian (5 mins) ⚡
3. *(Optional)* Translate SEO fields to Chinese (5 mins) ⚡
4. Publish (30 mins of work)

### Translation Fields in Admin

**Required Fields (English):**
- Article Title
- Article Content
- Article Excerpt

**Optional Fields (Other Languages):**
- Localized URL Slug (e.g., `/id/artikel/perlindungan-pesisir`)
- Title for SEO
- Excerpt for SEO
- Meta Title
- Meta Description

---

## Browser Translation

### How It Works

1. **LanguageSwitcher** sets `<html lang="{code}">`
2. **Auto-detection**: Browser detects language mismatch
3. **Auto-translate**: Chrome/Edge offer translation
4. **Fallback**: Google Translate widget for other browsers

### Supported Browsers

| Browser | Auto-Translate | Manual Translate |
|---------|----------------|------------------|
| Chrome | ✅ Yes | ✅ Yes |
| Edge | ✅ Yes | ✅ Yes |
| Safari | ⚠️ Limited | ✅ Yes (with widget) |
| Firefox | ⚠️ No | ✅ Yes (with widget) |
| Mobile | ✅ Yes (Chrome/Safari) | ✅ Yes |

---

## Rollback Plan

If you need to rollback:

```bash
# 1. Restore database backup
mysql -u your_user -p your_database < backup_YYYYMMDD.sql

# 2. Restore schema
cp prisma/schema.prisma.backup prisma/schema.prisma

# 3. Regenerate Prisma Client
npx prisma generate

# 4. Revert code changes
git checkout HEAD~1 -- src/
```

---

## Testing Checklist

After migration, test:

- [ ] Articles in English load correctly
- [ ] Articles in Indonesian show translated SEO fields
- [ ] Articles in Chinese show translated SEO fields
- [ ] Browser translation works in Chrome
- [ ] Google Translate widget works in Firefox
- [ ] Mobile devices can translate content
- [ ] SEO meta tags are correct per language
- [ ] Localized URLs work (e.g., `/id/artikel/...`)
- [ ] Admin can create new articles with English only
- [ ] Admin can optionally add SEO translations

---

## FAQ

**Q: What happens if I don't add translations?**
A: The system falls back to English SEO fields. Content is always in English and browser-translated.

**Q: Can I still add manual translations?**
A: Yes! You can add ArticleTranslation records with SEO fields anytime.

**Q: Will this affect SEO?**
A: No, SEO fields (title, meta description, URL slug) are still manually translated and stored in the database.

**Q: What if users don't have browser translation enabled?**
A: They'll see English content with translated navigation and UI elements.

**Q: Can I customize translation quality?**
A: For critical pages, you can still manually translate and store in the database. For general content, browser translation is usually good enough.

---

## Support

If you encounter issues:
1. Check the migration SQL output for errors
2. Verify Prisma Client is regenerated: `npx prisma generate`
3. Check browser console for JavaScript errors
4. Test in different browsers

---

**Migration Created:** 2025-11-15
**Schema Backup:** `prisma/schema.prisma.backup`
**Prisma Version:** 6.x
