# Calmsey

## Features

### Multi-language Support

- Dynamic language routing (`/`, `/id`)
- Content translation management
- Language-specific URLs and SEO

### Content Management

- Article creation and editing
- Category hierarchy management
- Tag system
- Media management
- Menu configuration

### SEO Optimized

- Dynamic sitemaps
- Meta tags and Open Graph
- Clean URL structure
- hreflang implementation

### User Experience

- Responsive design
- Fast page loads with SSR/SSG
- Smooth language switching
- Mobile-friendly navigation

## Deployment Checklist

1. **Environment Variables**

   ```bash
   DATABASE_URL=
   NEXTAUTH_URL=
   NEXTAUTH_SECRET=
   ```

2. **Database Setup**

   ```bash
   npm run db:push
   npm run db:seed
   ```

3. **Build and Deploy**

   ```bash
   npm run build
   npm start
   ```

4. **SEO Configuration**
   - Update domain in `sitemap.ts` and `robots.ts`
   - Configure Google Analytics
   - Set up Search Console

## Project Structure

```text
src/
├── app/
│   ├── [lang]/          # Language-specific routes
│   │   ├── articles/    # Article pages
│   │   ├── [...slug]/   # Dynamic category pages
│   │   └── contact/     # Contact page
│   ├── admin/           # Admin panel
│   └── api/             # API routes
├── components/
│   ├── public/          # Public components
│   └── admin/           # Admin components
└── lib/
    ├── public-api.ts    # Public API functions
    ├── prisma.ts        # Database client
    └── utils.ts         # Utilities
```
