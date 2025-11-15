# Headless CMS Guide

## 🎯 Overview

This CMS uses a **Headless CMS Approach** where:
- ✅ **Frontend design** is controlled by developers (React components)
- ✅ **Content** is fully editable by admins via simple forms
- ✅ **No complex page builders** needed (no drag & drop, no visual editors)
- ✅ **Maximum flexibility** for design changes
- ✅ **Type-safe** with TypeScript
- ✅ **Fast performance** with static components

### Why Headless CMS?

**Traditional Page Builder (Elementor, etc):**
- ❌ Complex admin UI (drag & drop, visual editor)
- ❌ Runtime layout calculation (slower)
- ❌ Difficult to maintain consistent design
- ❌ Hard to make design changes
- ⚠️ Risk of "broken layouts" by non-technical users

**Headless CMS:**
- ✅ Simple forms (easy for content editors)
- ✅ Static components (faster, predictable)
- ✅ Design controlled by developers (consistent, professional)
- ✅ Easy to redesign (just edit React components)
- ✅ Git-based version control for design

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (React Components - Fixed)    │
│  - HeroSection.tsx                      │
│  - WhyUsSection.tsx                     │
│  - Layout & styling controlled by devs  │
└─────────────────────────────────────────┘
                ↓ fetches
┌─────────────────────────────────────────┐
│  Database (PageContent - Editable)      │
│  - hero.title: "Welcome..."             │
│  - hero.backgroundImage: "/img/..."     │
│  - Key-value pairs for content          │
└─────────────────────────────────────────┘
                ↑ admin edits
┌─────────────────────────────────────────┐
│  Admin Panel (Forms - Simple)           │
│  - Input fields for text                │
│  - Image upload                         │
│  - Rich text editor                     │
└─────────────────────────────────────────┘
```

---

## 📚 Table of Contents

1. [For Content Editors (Admin)](#for-content-editors-admin)
2. [For Developers (Frontend Integration)](#for-developers-frontend-integration)
3. [Schema Configuration](#schema-configuration)
4. [API Reference](#api-reference)
5. [Examples](#examples)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## 👥 For Content Editors (Admin)

### Accessing Page Content Editor

1. **Login** to admin panel: `/admin/login`
2. **Navigate** to: **Admin → Page Content Manager** or `/admin/page-content`
3. **Select** the page you want to edit (Home, About Us, Contact, etc)
4. **Edit** content in the form
5. **Save** changes

### Available Pages

| Page | Description |
|------|-------------|
| **Home** | Main landing page with hero, sections, latest articles |
| **About Us** | Company information, vision, mission, team |
| **Our Work** | Case studies, approach, success stories |
| **Governance** | Values, principles, funders, committees |
| **Get Involved** | How to help, opportunities |
| **Contact** | Contact information, office hours |

### Editing Content

#### Text Fields
Simple one-line text input:
- Hero Title
- Section headings
- Button text
- etc.

#### Textarea Fields
Multi-line text input:
- Descriptions
- Short paragraphs
- Addresses

#### HTML/Rich Text Fields
For formatted content:
- Mission statements
- Long descriptions
- Content with headings, lists, links

**Tips:**
- Use `<p>` tags for paragraphs
- Use `<h2>`, `<h3>` for headings
- Use `<ul>`, `<li>` for lists
- Use `<a href="...">` for links

#### Image Fields
Enter image URL or path:
- `/images/hero-background.jpg` (local image)
- `https://example.com/image.jpg` (external image)
- Upload images via **Media Library** first, then copy URL

#### Number Fields
For statistics, counts, etc:
- Communities Served: `150`
- Projects: `85`

#### JSON Fields
For complex data structures (advanced):
```json
[
  {
    "name": "John Doe",
    "role": "CEO",
    "image": "/images/team/john.jpg"
  },
  {
    "name": "Jane Smith",
    "role": "CTO",
    "image": "/images/team/jane.jpg"
  }
]
```

### Multi-Language Support

Currently supports English by default. Additional languages can be added via:
- Language settings in admin
- Translations will use same content structure

### Publishing Changes

Changes are **immediately live** after clicking "Save Changes". No additional publish step needed.

⚠️ **Important:** Always preview changes before saving critical content.

---

## 💻 For Developers (Frontend Integration)

### Quick Start

1. **Fetch content** in your page/component:
```typescript
import { getPageContent } from '@/lib/page-content';

const content = await getPageContent('HOME', 'en');
```

2. **Use content** in your components:
```typescript
<HeroSection
  title={content.getString('hero.title')}
  subtitle={content.getString('hero.subtitle')}
  backgroundImage={content.getString('hero.backgroundImage')}
/>
```

### Integration Example (HOME Page)

**Before (Hardcoded):**
```typescript
// src/app/[lang]/page.tsx
export default function HomePage() {
  return (
    <>
      <HeroSection
        variant="video"
        posterImage="/assets/demo/bg-video.png"
        videoUrl="/assets/video/8248432-hd_1280_720_30fps.mp4"
      />
      <WhyTurningTidesSection />
      {/* ... other sections */}
    </>
  );
}
```

**After (Dynamic from DB):**
```typescript
// src/app/[lang]/page.tsx
import { getPageContent } from '@/lib/page-content';

export default async function HomePage({
  params
}: {
  params: { lang: string }
}) {
  // Fetch page content from database
  const content = await getPageContent('HOME', params.lang);

  return (
    <>
      <HeroSection
        variant={content.getString('hero.variant', 'video')}
        posterImage={content.getString('hero.posterImage')}
        videoUrl={content.getString('hero.videoUrl')}
        title={content.getString('hero.title')}
        subtitle={content.getString('hero.subtitle')}
      />

      <WhyTurningTidesSection
        title={content.getString('whyUs.title')}
        content={content.getString('whyUs.content')}
      />

      {/* ... other sections */}
    </>
  );
}
```

### PageContentMap Methods

```typescript
// Get string (with fallback)
content.getString('hero.title', 'Default Title')

// Get number
content.getNumber('stats.communities', 0)

// Get boolean
content.getBoolean('feature.enabled', false)

// Get JSON (parsed automatically)
content.getJSON<TeamMember[]>('team.members', [])
```

### Updating Existing Components

#### Option 1: Pass Props
Update component to accept props from database:

```typescript
// components/main/HeroSection.tsx
interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  // ... other props
}

export function HeroSection({
  title = 'Default Title',
  subtitle,
  backgroundImage,
  ...props
}: HeroSectionProps) {
  return (
    <section>
      {/* Use props instead of hardcoded values */}
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {/* ... */}
    </section>
  );
}
```

#### Option 2: Fetch Inside Component
For client components, fetch data inside:

```typescript
'use client';

import { useState, useEffect } from 'react';

export function HeroSection() {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/admin/page-content/HOME?language=en')
      .then(r => r.json())
      .then(data => setContent(data.content));
  }, []);

  return (
    <section>
      <h1>{content['hero.title'] || 'Loading...'}</h1>
      {/* ... */}
    </section>
  );
}
```

**Recommendation:** Use Option 1 (Server Components with props) for better performance and SEO.

---

## ⚙️ Schema Configuration

### Adding New Fields

Edit `src/lib/page-content-schema.ts`:

```typescript
const HOME_SCHEMA: PageContentSchema = {
  pageType: 'HOME',
  sections: ['Hero', 'Features', /* ... */],
  fields: [
    // Add new field
    {
      key: 'hero.ctaText',
      label: 'Call-to-Action Button Text',
      type: 'text',
      section: 'Hero',
      required: false,
      defaultValue: 'Get Started',
      placeholder: 'Enter button text',
      helpText: 'Text displayed on the main CTA button',
    },
    // ... existing fields
  ],
};
```

### Field Types

| Type | Description | Example |
|------|-------------|---------|
| `text` | Single-line text | Title, button text |
| `textarea` | Multi-line text | Descriptions, addresses |
| `html` | HTML content | Rich text with formatting |
| `image` | Image URL | Hero background, logos |
| `number` | Numeric value | Statistics, counts |
| `url` | URL/Link | CTA links, external resources |
| `email` | Email address | Contact email |
| `phone` | Phone number | Contact phone |
| `json` | JSON data | Team members, complex data |
| `color` | Color picker | Theme colors |
| `boolean` | Checkbox | Feature flags |

### Field Options

```typescript
{
  key: 'field.name',           // Unique key (dot notation for grouping)
  label: 'Field Label',        // Displayed in admin
  type: 'text',                // Field type
  section: 'Section Name',     // Group fields by section
  required: true,              // Is this field required?
  defaultValue: 'Default',     // Default value if empty
  placeholder: 'Enter text',   // Placeholder text
  helpText: 'Help message',    // Help text below field
  validation: {                // Validation rules (for numbers)
    min: 0,
    max: 100,
  },
}
```

### Creating New Page Type

1. **Add to Prisma Schema** (if not exists):
```prisma
enum PageType {
  HOME
  ABOUT_US
  SERVICES  // Add new type
  // ...
}
```

2. **Define Schema**:
```typescript
const SERVICES_SCHEMA: PageContentSchema = {
  pageType: 'SERVICES',
  sections: ['Hero', 'Services List'],
  fields: [
    {
      key: 'hero.title',
      label: 'Page Title',
      type: 'text',
      section: 'Hero',
      required: true,
    },
    // ... more fields
  ],
};
```

3. **Add to Exports**:
```typescript
export const PAGE_CONTENT_SCHEMAS: Record<string, PageContentSchema> = {
  HOME: HOME_SCHEMA,
  ABOUT_US: ABOUT_US_SCHEMA,
  SERVICES: SERVICES_SCHEMA, // Add new schema
};
```

4. **Create Frontend Page**:
```typescript
// src/app/[lang]/services/page.tsx
import { getPageContent } from '@/lib/page-content';

export default async function ServicesPage({ params }) {
  const content = await getPageContent('SERVICES', params.lang);

  return (
    <div>
      <h1>{content.getString('hero.title')}</h1>
      {/* ... */}
    </div>
  );
}
```

---

## 📡 API Reference

### Fetch Page Content

```typescript
GET /api/admin/page-content/[pageType]?language=en

Response:
{
  "pageType": "HOME",
  "language": "en",
  "content": {
    "hero.title": "Welcome to TurningTides",
    "hero.subtitle": "Protecting coastal communities",
    // ... all content fields
  }
}
```

### Save Page Content

```typescript
POST /api/admin/page-content/[pageType]

Body:
{
  "language": "en",
  "content": {
    "hero.title": "Updated Title",
    "hero.subtitle": "Updated Subtitle",
    // ... fields to update
  }
}

Response:
{
  "success": true,
  "message": "Page content saved successfully",
  "pageType": "HOME",
  "language": "en"
}
```

### Delete Page Content

```typescript
DELETE /api/admin/page-content/[pageType]?language=en

Response:
{
  "success": true,
  "message": "Page content deleted successfully"
}
```

### Helper Functions

```typescript
// Get page content as Map
const content = await getPageContent('HOME', 'en');

// Get page content as object
const contentObj = await getPageContentObject('HOME', 'en');

// Save content
await savePageContent('HOME', 'en', contentObj, userId);

// Check if content exists
const exists = await pageContentExists('HOME', 'en');

// Delete content
await deletePageContent('HOME', 'en');
```

---

## 🎨 Examples

### Example 1: Simple Hero Section

**Schema Definition:**
```typescript
fields: [
  {
    key: 'hero.title',
    label: 'Hero Title',
    type: 'text',
    section: 'Hero',
    required: true,
  },
  {
    key: 'hero.subtitle',
    label: 'Hero Subtitle',
    type: 'textarea',
    section: 'Hero',
  },
  {
    key: 'hero.backgroundImage',
    label: 'Background Image',
    type: 'image',
    section: 'Hero',
  },
]
```

**Frontend Integration:**
```typescript
const content = await getPageContent('HOME', 'en');

<section style={{ backgroundImage: `url(${content.getString('hero.backgroundImage')})` }}>
  <h1>{content.getString('hero.title')}</h1>
  <p>{content.getString('hero.subtitle')}</p>
</section>
```

### Example 2: Stats Section with Numbers

**Schema Definition:**
```typescript
fields: [
  {
    key: 'stats.communities',
    label: 'Communities Served',
    type: 'number',
    section: 'Statistics',
    validation: { min: 0 },
  },
  {
    key: 'stats.projects',
    label: 'Projects Completed',
    type: 'number',
    section: 'Statistics',
  },
]
```

**Frontend Integration:**
```typescript
const content = await getPageContent('HOME', 'en');

<div className="stats">
  <div className="stat">
    <h3>{content.getNumber('stats.communities')}</h3>
    <p>Communities Served</p>
  </div>
  <div className="stat">
    <h3>{content.getNumber('stats.projects')}</h3>
    <p>Projects Completed</p>
  </div>
</div>
```

### Example 3: Team Members (JSON)

**Schema Definition:**
```typescript
{
  key: 'team.members',
  label: 'Team Members',
  type: 'json',
  section: 'Team',
  helpText: 'Array of team member objects',
}
```

**Admin Input (JSON):**
```json
[
  {
    "name": "John Doe",
    "role": "CEO",
    "image": "/images/team/john.jpg",
    "bio": "20 years of experience..."
  },
  {
    "name": "Jane Smith",
    "role": "CTO",
    "image": "/images/team/jane.jpg",
    "bio": "Expert in marine conservation..."
  }
]
```

**Frontend Integration:**
```typescript
interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const content = await getPageContent('ABOUT_US', 'en');
const teamMembers = content.getJSON<TeamMember[]>('team.members', []);

<div className="team-grid">
  {teamMembers.map((member, index) => (
    <div key={index} className="team-member">
      <img src={member.image} alt={member.name} />
      <h3>{member.name}</h3>
      <p className="role">{member.role}</p>
      <p className="bio">{member.bio}</p>
    </div>
  ))}
</div>
```

---

## ✅ Best Practices

### For Content Editors

1. **Always preview changes** before saving critical content
2. **Use Media Library** for image uploads (don't use external URLs)
3. **Keep JSON formatting correct** (use JSON validator tools)
4. **Write clear, concise copy** that fits the design
5. **Test on mobile** after major content changes

### For Developers

1. **Always provide fallback values**:
   ```typescript
   content.getString('hero.title', 'Default Title')
   ```

2. **Validate data before use**:
   ```typescript
   const members = content.getJSON<TeamMember[]>('team.members', []);
   if (Array.isArray(members) && members.length > 0) {
     // Use members
   }
   ```

3. **Use TypeScript interfaces** for JSON data:
   ```typescript
   interface HeroContent {
     title: string;
     subtitle: string;
     backgroundImage: string;
   }
   ```

4. **Keep components flexible**:
   ```typescript
   // Allow both props and content fetching
   interface Props {
     title?: string; // Can be passed as prop
   }

   const title = props.title || content.getString('hero.title');
   ```

5. **Document schema changes** in code comments
6. **Test with empty/missing content** scenarios
7. **Use Server Components** when possible for better performance

### Schema Design

1. **Use dot notation** for related fields:
   ```typescript
   'hero.title'
   'hero.subtitle'
   'hero.backgroundImage'
   ```

2. **Group by sections** for better admin UX
3. **Provide helpful labels and help text**
4. **Set appropriate default values**
5. **Use validation for critical fields**

---

## 🔧 Troubleshooting

### Content Not Showing

**Problem:** Updated content in admin but not showing on frontend

**Solutions:**
1. Check if you're fetching content in the page
2. Clear browser cache (Ctrl+Shift+R)
3. Verify content was saved (check database or fetch via API)
4. Check for JavaScript errors in console

### Images Not Loading

**Problem:** Image URL entered but image not displaying

**Solutions:**
1. Verify image URL is correct (check for typos)
2. Ensure image is uploaded to Media Library first
3. Check image path is relative (`/images/...`) or absolute URL
4. Verify image file exists and is accessible

### JSON Parse Error

**Problem:** "Invalid JSON format" error when saving

**Solutions:**
1. Use a JSON validator tool (jsonlint.com)
2. Check for:
   - Missing commas
   - Missing quotes
   - Trailing commas
   - Unclosed brackets/braces
3. Example correct format:
   ```json
   [
     {"key": "value"},
     {"key": "value"}
   ]
   ```

### Field Not Showing in Admin

**Problem:** Added field to schema but not showing in admin form

**Solutions:**
1. Verify field is added to correct page schema
2. Check `section` matches one in `sections` array
3. Clear Next.js cache: `rm -rf .next`
4. Restart dev server

### Permission Denied

**Problem:** "Forbidden" error when trying to save

**Solutions:**
1. Check user role (must be EDITOR or higher)
2. Verify you're logged in
3. Check session hasn't expired
4. Contact admin if role is incorrect

---

## 🚀 Next Steps

### Enhancing the System

1. **Add Rich Text Editor**:
   - Integrate TinyMCE or Tiptap
   - Replace textarea for HTML fields
   - WYSIWYG editing experience

2. **Image Upload Widget**:
   - Direct upload from content editor
   - Image cropping/resizing
   - Integration with Media Library

3. **Preview Mode**:
   - Live preview of changes
   - Before/after comparison
   - Mobile preview

4. **Version History**:
   - Track content changes
   - Rollback to previous versions
   - Compare versions

5. **Scheduled Publishing**:
   - Set publish date/time
   - Draft vs Published states
   - Automatic publishing

---

## 📞 Support

For questions or issues:
1. Check this documentation
2. Review code comments in:
   - `src/lib/page-content-schema.ts`
   - `src/lib/page-content.ts`
   - `src/components/admin/PageContentEditor.tsx`
3. Contact development team

---

**Last Updated:** 2025-11-15
**Version:** 1.0.0
**System:** Headless CMS for TurningTides
