# Hybrid Translation System

## Overview

This CMS now uses a **Hybrid Translation Approach** that combines:
- 📝 **Manual translation** for SEO-critical fields (title, meta tags, URL slugs)
- 🌐 **Browser translation** for content body (automatic + Google Translate fallback)

### Benefits

✅ **80% less translation work** - Only translate SEO fields, not full content
✅ **Faster publishing** - Write in English, auto-translate instantly
✅ **SEO-optimized** - Meta tags still manually translated
✅ **Cost-effective** - No need for expensive translation services
✅ **Flexible** - Can still add manual translations when needed

---

## How It Works

### Content Structure

```
Article (English - Default)
├── title: "Coastal Protection Strategies"
├── content: "Coastal areas are vulnerable..." (LONG CONTENT)
└── excerpt: "Learn about effective..."

ArticleTranslation (Indonesian - SEO Only)
├── slug: "strategi-perlindungan-pesisir"
├── title: "Strategi Perlindungan Pesisir"
├── excerpt: "Pelajari tentang..."
├── seoTitle: "Strategi Perlindungan Pesisir | TurningTides"
└── seoDescription: "Panduan lengkap tentang..."

Note: content is NOT stored here!
Browser translates Article.content automatically.
```

### Translation Flow

```
User visits: /id/articles/strategi-perlindungan-pesisir
             ↓
API fetches:
  - ArticleTranslation (id="id") → SEO fields (title, meta, slug)
  - Article → Content (English)
             ↓
Response:
  {
    slug: "strategi-perlindungan-pesisir",  // Indonesian
    title: "Strategi Perlindungan Pesisir", // Indonesian
    content: "Coastal areas are...",        // English (browser translates)
    excerpt: "Pelajari tentang...",         // Indonesian
    seoTitle: "...",                        // Indonesian
    seoDescription: "..."                   // Indonesian
  }
             ↓
Frontend:
  - Sets <html lang="id">
  - Browser auto-translates content
  - Displays Indonesian SEO meta tags
```

---

## Features

### 1. Browser Translation

**LanguageSwitcher** (`src/components/public/LanguageSwitcher.tsx`):
- Sets `<html lang="{code}">` attribute
- Triggers browser auto-translation (Chrome, Edge)
- Falls back to Google Translate widget (Firefox, Safari)

**Browser Support:**
| Browser | Method | Quality |
|---------|--------|---------|
| Chrome | Auto | Excellent ✅ |
| Edge | Auto | Excellent ✅ |
| Safari | Widget | Good ⚠️ |
| Firefox | Widget | Good ⚠️ |

### 2. SEO Optimization

**Meta Tags** (per language):
```html
<!-- Indonesian page -->
<html lang="id">
<head>
  <title>Strategi Perlindungan Pesisir | TurningTides</title>
  <meta name="description" content="Panduan lengkap tentang..." />
  <link rel="canonical" href="/id/articles/strategi-perlindungan-pesisir" />
  <link rel="alternate" hreflang="en" href="/articles/coastal-protection" />
  <link rel="alternate" hreflang="id" href="/id/articles/strategi-perlindungan-pesisir" />
</head>
```

### 3. Optional Manual Translation

You can still add full manual translations for important content:

```typescript
// In ArticleTranslation, you can optionally store full content
// But it's not required - system falls back to English + browser translation
```

---

## Database Schema

### Article Model

```prisma
model Article {
  id            String  @id @default(cuid())
  slug          String  @unique // English slug

  // ✅ NEW: Default content in English
  title         String
  content       String  @db.LongText
  excerpt       String? @db.Text

  status        ArticleStatus @default(DRAFT)
  featuredImage String?
  publishedAt   DateTime?

  translations  ArticleTranslation[] // Optional SEO translations
}
```

### ArticleTranslation Model

```prisma
model ArticleTranslation {
  id             String  @id @default(cuid())

  // ✅ SEO fields only (content uses Article.content + browser translation)
  slug           String? // Localized URL
  title          String
  excerpt        String? @db.Text
  seoTitle       String?
  seoDescription String? @db.Text

  articleId  String
  article    Article @relation(...)
  languageId String
  language   Language @relation(...)

  @@unique([articleId, languageId])
  @@unique([articleId, slug])
}
```

### PageSection Model

```prisma
model PageSection {
  id       String          @id @default(cuid())
  type     PageSectionType
  order    Int             @default(0)

  // ✅ NEW: Default content in English
  title    String?
  subtitle String?
  content  String @db.LongText

  translations PageSectionTranslation[] // Optional for navigation
}
```

### PageSectionTranslation Model

```prisma
model PageSectionTranslation {
  id       String @id @default(cuid())

  // ✅ Navigation only (for TOC, anchors)
  title    String?
  subtitle String?

  // ❌ content field removed (uses PageSection.content)

  sectionId  String
  section    PageSection @relation(...)
  languageId String
  language   Language @relation(...)

  @@unique([sectionId, languageId])
}
```

---

## Usage Examples

### Creating an Article (Admin)

**Minimum Required (English only):**
```typescript
// 1. Create Article with English content
const article = await prisma.article.create({
  data: {
    slug: 'coastal-protection',
    title: 'Coastal Protection Strategies',
    content: '<p>Coastal areas are vulnerable to...</p>',
    excerpt: 'Learn about effective coastal protection...',
    status: 'PUBLISHED',
    authorId: user.id,
  },
});

// 2. Publish! ✅
// Indonesian users will see:
// - Title: Auto-translated
// - Content: Auto-translated by browser
// - SEO: Uses English meta tags (still indexed by Google)
```

**With Indonesian SEO Translation (Optional):**
```typescript
// 1. Create Article (same as above)

// 2. Add Indonesian SEO translation
await prisma.articleTranslation.create({
  data: {
    articleId: article.id,
    languageId: 'id',
    slug: 'strategi-perlindungan-pesisir', // Localized URL
    title: 'Strategi Perlindungan Pesisir',
    excerpt: 'Pelajari tentang perlindungan pesisir yang efektif...',
    seoTitle: 'Strategi Perlindungan Pesisir | TurningTides',
    seoDescription: 'Panduan lengkap tentang strategi...',
  },
});

// 3. Publish! ✅✅
// Indonesian users will see:
// - Title: Manually translated (better for SEO)
// - Content: Auto-translated by browser
// - SEO: Optimized Indonesian meta tags
// - URL: /id/articles/strategi-perlindungan-pesisir
```

### Fetching Article (API)

```typescript
// src/app/api/public/articles/[slug]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';

  // 1. Find article by slug or translation slug
  const article = await prisma.article.findFirst({
    where: {
      OR: [
        { slug: params.slug },
        { translations: { some: { slug: params.slug } } },
      ],
    },
    include: {
      translations: {
        where: { languageId: lang },
      },
    },
  });

  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // 2. Use translation if available, otherwise fallback to English
  const translation = article.translations[0];

  const response = {
    id: article.id,
    slug: translation?.slug || article.slug,
    title: translation?.title || article.title,
    content: article.content, // ⚡ Always English (browser translates)
    excerpt: translation?.excerpt || article.excerpt,
    seoTitle: translation?.seoTitle || article.title,
    seoDescription: translation?.seoDescription || article.excerpt,
    featuredImage: article.featuredImage,
    publishedAt: article.publishedAt,

    // Metadata for frontend
    isTranslated: !!translation,
    contentLanguage: 'en', // Indicates content needs browser translation
    metaLanguage: translation ? lang : 'en',
  };

  return NextResponse.json(response);
}
```

### Displaying Article (Frontend)

```typescript
// src/components/public/ArticlePage.tsx
export function ArticlePage({ article, language }: ArticlePageProps) {
  return (
    <div className="article">
      {/* SEO Meta Tags */}
      <Head>
        <title>{article.seoTitle}</title>
        <meta name="description" content={article.seoDescription} />
      </Head>

      {/* Article Content */}
      <h1>{article.title}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: article.content }}
        // Browser translates this automatically
        // because LanguageSwitcher set <html lang="{code}">
      />
    </div>
  );
}
```

---

## Migration Guide

See `MIGRATION_HYBRID_TRANSLATION.md` for detailed migration instructions.

**Quick Start:**

```bash
# 1. Backup database
mysqldump -u user -p database > backup.sql

# 2. Update schema (already done)
# prisma/schema.prisma has been updated

# 3. Generate migration
npx prisma migrate dev --name hybrid_translation

# 4. Migrate existing data
# Run SQL to copy English translations to main Article model
# See MIGRATION_HYBRID_TRANSLATION.md for SQL scripts

# 5. Test
npm run dev
# Visit /id/articles and check browser translation
```

---

## Configuration

### Supported Languages

Edit `src/lib/browser-translate.ts` to add/remove languages:

```typescript
export const LANGUAGE_CODES: Record<string, string> = {
  en: 'en', // English
  id: 'id', // Indonesian
  zh: 'zh-CN', // Chinese (Simplified)
  // Add more languages here
};
```

### Translation Widget Customization

For browsers without auto-translation, a Google Translate widget is used.
Customize appearance in `src/lib/browser-translate.ts`:

```typescript
new google.translate.TranslateElement(
  {
    pageLanguage: 'en',
    includedLanguages: 'en,id,zh-CN,es,fr', // Customize this
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false, // Set true to auto-display widget
  },
  'google_translate_element'
);
```

---

## Testing

### Manual Testing Checklist

- [ ] Visit article in English: `/articles/coastal-protection`
- [ ] Switch to Indonesian: `/id/articles/strategi-perlindungan-pesisir`
- [ ] Check HTML lang attribute: `<html lang="id">`
- [ ] Verify browser offers translation (Chrome/Edge)
- [ ] Check SEO meta tags in Indonesian
- [ ] Test in different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Verify fallback when no translation exists

### Automated Testing

```typescript
// Example test
describe('Hybrid Translation', () => {
  it('should return English content with Indonesian SEO', async () => {
    const response = await fetch('/api/public/articles/test?lang=id');
    const data = await response.json();

    expect(data.title).toBe('Indonesian Title'); // From translation
    expect(data.content).toContain('English content'); // From article
    expect(data.seoTitle).toBe('Indonesian SEO Title');
  });

  it('should fallback to English when translation missing', async () => {
    const response = await fetch('/api/public/articles/test?lang=zh');
    const data = await response.json();

    expect(data.title).toBe('English Title'); // Fallback
    expect(data.content).toContain('English content');
  });
});
```

---

## Troubleshooting

### Issue: Browser doesn't translate content

**Solution:**
1. Check HTML lang attribute: `document.documentElement.lang`
2. Verify browser supports translation (Chrome/Edge recommended)
3. Check browser translation settings (should be enabled)
4. Try Google Translate widget fallback

### Issue: SEO meta tags in wrong language

**Solution:**
1. Check if ArticleTranslation exists for that language
2. Verify API returns correct translation data
3. Check frontend meta tag rendering

### Issue: Localized URLs not working

**Solution:**
1. Verify ArticleTranslation has `slug` field populated
2. Check API query includes `OR` condition for both slugs
3. Verify Next.js routing handles language prefix

### Issue: Google Translate widget not appearing

**Solution:**
1. Check if script loaded: `window.google.translate`
2. Verify container element exists: `#google_translate_element`
3. Check browser console for errors
4. Try reloading page

---

## Best Practices

### For Content Creators

1. **Write in English first** - This is your source content
2. **Add SEO translations** - At minimum, translate:
   - Title
   - Excerpt
   - Meta description
   - URL slug
3. **Test browser translation** - Check how content looks when translated
4. **Use simple language** - Easier for browsers to translate accurately
5. **Avoid idioms/slang** - May not translate well

### For Developers

1. **Always set lang attribute** - Use `LanguageSwitcher` component
2. **Provide fallbacks** - Handle missing translations gracefully
3. **Test across browsers** - Chrome, Firefox, Safari, Edge
4. **Monitor translation quality** - User feedback is important
5. **Keep SEO in mind** - Meta tags, hreflang, canonical URLs

### For SEO

1. **Translate meta tags** - Title, description for each language
2. **Use hreflang tags** - Indicate language variants
3. **Localize URLs** - Use language-specific slugs
4. **Add structured data** - In appropriate language
5. **Submit sitemaps** - One per language to Search Console

---

## Performance

### Impact

- ✅ **Reduced database size** - No duplicate content
- ✅ **Faster API responses** - Less data to fetch
- ✅ **Simpler caching** - One content, multiple languages
- ⚠️ **Initial page load** - Slightly slower as browser translates

### Optimization Tips

1. **Cache translated pages** - Use service workers
2. **Preload translation script** - For browsers without auto-translation
3. **Lazy load Google Translate** - Only when needed
4. **Use CDN** - Serve static content from edge locations

---

## Future Enhancements

Potential improvements:

1. **AI Translation API** - Use DeepL/Google Translate API for pre-translation
2. **Translation Memory** - Store common phrases for consistency
3. **User Preferences** - Remember language choice across sessions
4. **Quality Indicators** - Show translation quality scores
5. **Hybrid Mode Toggle** - Let users choose manual vs auto translation

---

## Support

For questions or issues:
1. Check this README
2. See MIGRATION_HYBRID_TRANSLATION.md
3. Review code comments in:
   - `src/lib/browser-translate.ts`
   - `src/components/public/LanguageSwitcher.tsx`
4. Open an issue in the repository

---

**Last Updated:** 2025-11-15
**Version:** 1.0.0
**Schema:** Hybrid Translation v1
