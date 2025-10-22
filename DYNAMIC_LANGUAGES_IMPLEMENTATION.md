# Dynamic Languages Implementation

## Overview

Implementasi sistem bahasa dinamis yang menggunakan database sebagai sumber utama, menggantikan hardcoded `SUPPORTED_LANGUAGES`.

## Files Created/Modified

### 1. Dynamic Languages Service

**File:** `src/lib/dynamic-languages.ts`

- Service utama untuk mengelola bahasa dari database
- Caching dengan TTL 5 menit untuk performa
- Functions: `getActiveLanguages()`, `getDefaultLanguage()`, `isValidLanguage()`
- Cache management: `clearLanguageCache()`

### 2. Updated Public API

**File:** `src/lib/public-api.ts`

- Updated untuk menggunakan dynamic languages
- Backward compatibility dengan legacy constants
- New functions: `getSupportedLanguages()`, `getDefaultLanguageDynamic()`
- Type `SupportedLanguage` diubah dari const ke string

### 3. Updated Constants

**File:** `src/lib/constants.ts`

- Legacy constants untuk backward compatibility
- Updated type definitions
- Fallback functions untuk synchronous operations

### 4. Updated Middleware

**File:** `src/middleware.ts`

- Menggunakan dynamic languages dengan caching
- Fallback ke static languages jika database error
- Performance optimization dengan cache TTL

### 5. Language Switcher Component

**File:** `src/components/public/LanguageSwitcher.tsx`

- Menggunakan data dinamis dari database
- Visual enhancements dengan flag emoji
- Loading dan error states

### 6. Custom Hook

**File:** `src/hooks/useActiveLanguages.ts`

- Hook untuk fetch bahasa aktif dari API
- State management untuk loading, error, dan data
- Function `refetch` untuk refresh data

## Database Schema

### Languages Table

```sql
CREATE TABLE `languages` (
  `id` VARCHAR(191) NOT NULL,           -- Language code (e.g., "en", "id", "es")
  `name` VARCHAR(191) NOT NULL,         -- Display name (e.g., "English", "Español")
  `flag` VARCHAR(191) NULL,             -- Flag emoji (e.g., "🇺🇸", "🇪🇸")
  `isDefault` BOOLEAN NOT NULL DEFAULT false,  -- Default language
  `isActive` BOOLEAN NOT NULL DEFAULT true,     -- Active status
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
);
```

## API Endpoints

### Public API

- `GET /api/public/languages` - Get active languages
- Response: `{ success: boolean, data: DynamicLanguage[] }`

### Admin API

- `GET /api/admin/languages` - Get all languages (with filters)
- `POST /api/admin/languages` - Create new language
- `PUT /api/admin/languages/[id]` - Update language
- `DELETE /api/admin/languages/[id]` - Delete language

## Features

### ✅ Dynamic Language Loading

- Bahasa diambil dari database, bukan hardcoded
- Hanya menampilkan bahasa dengan `isActive: true`
- Support untuk 112+ bahasa

### ✅ Performance Optimization

- Caching dengan TTL 5 menit
- Fallback ke static languages jika database error
- Efficient middleware dengan cache

### ✅ Admin Control

- Admin bisa mengaktifkan/nonaktifkan bahasa
- Admin bisa mengubah bahasa default
- Real-time updates dengan cache invalidation

### ✅ Visual Enhancements

- Flag emoji untuk setiap bahasa
- Indikator "(Default)" untuk bahasa default
- Loading dan error states

### ✅ Backward Compatibility

- Legacy constants tetap berfungsi
- Gradual migration dari static ke dynamic
- Fallback mechanisms

## Usage Examples

### Basic Usage

```tsx
import { LanguageSwitcher } from "@/components/public/LanguageSwitcher";

<LanguageSwitcher currentLanguage="en" />;
```

### Using Dynamic Languages in Components

```tsx
import { useActiveLanguages } from "@/hooks/useActiveLanguages";

function MyComponent() {
  const { languages, loading, error } = useActiveLanguages();

  if (loading) return <div>Loading languages...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {languages.map((lang) => (
        <div key={lang.id}>
          {lang.flag} {lang.name}
          {lang.isDefault && " (Default)"}
        </div>
      ))}
    </div>
  );
}
```

### Using Dynamic Languages in Server Components

```tsx
import { getActiveLanguages } from "@/lib/dynamic-languages";

export async function MyServerComponent() {
  const languages = await getActiveLanguages();

  return (
    <div>
      {languages.map((lang) => (
        <div key={lang.id}>{lang.name}</div>
      ))}
    </div>
  );
}
```

## Migration Strategy

### Phase 1: Setup Dynamic System ✅

- Create dynamic-languages.ts service
- Update public-api.ts with dynamic functions
- Maintain backward compatibility

### Phase 2: Update Components ✅

- Update LanguageSwitcher to use dynamic data
- Create useActiveLanguages hook
- Add visual enhancements

### Phase 3: Update Middleware ✅

- Update middleware to use dynamic languages
- Add caching for performance
- Add fallback mechanisms

### Phase 4: Admin Interface (Future)

- Create admin interface for language management
- Add bulk operations
- Add language import/export

## Performance Considerations

### Caching Strategy

- **Service Level**: 5-minute TTL cache in dynamic-languages.ts
- **Middleware Level**: 5-minute TTL cache in middleware.ts
- **Component Level**: React hook with built-in caching

### Fallback Mechanisms

- Database error → Static languages
- Cache miss → Database query
- Network error → Cached data

### Database Optimization

- Index on `isActive` and `isDefault` fields
- Efficient queries with select only needed fields
- Connection pooling for high traffic

## Benefits

1. **Scalability**: Support untuk 112+ bahasa tanpa code changes
2. **Flexibility**: Admin bisa mengelola bahasa secara real-time
3. **Performance**: Multi-level caching untuk optimal performance
4. **Maintainability**: Separation of concerns dengan service layer
5. **User Experience**: Visual enhancements dengan flag dan status
6. **Backward Compatibility**: Gradual migration tanpa breaking changes

## Testing

### Manual Testing

```bash
# Test API endpoint
curl http://localhost:3000/api/public/languages

# Test with different languages
curl http://localhost:3000/es/  # Spanish
curl http://localhost:3000/fr/  # French
```

### Database Seeding

```bash
# Add more languages for testing
npx tsx scripts/seed-more-languages.ts
```

## Future Enhancements

1. **Language Detection**: Auto-detect user language from browser
2. **RTL Support**: Right-to-left language support
3. **Language Analytics**: Track language usage statistics
4. **Bulk Operations**: Import/export language configurations
5. **Language Packs**: Pre-configured language sets for different regions
