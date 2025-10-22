# Language Switcher Implementation

## Overview

Implementasi Language Switcher yang menampilkan opsi bahasa aktif dari database, bukan hardcoded.

## Files Created/Modified

### 1. API Endpoint

**File:** `src/app/api/public/languages/route.ts`

- Endpoint untuk mendapatkan bahasa aktif dari database
- Filter berdasarkan `isActive: true`
- Urutan: default language pertama, kemudian alfabetis

### 2. Custom Hook

**File:** `src/hooks/useActiveLanguages.ts`

- Hook untuk fetch bahasa aktif dari API
- State management untuk loading, error, dan data
- Function `refetch` untuk refresh data

### 3. Updated Component

**File:** `src/components/public/LanguageSwitcher.tsx`

- Menggunakan data dari database via hook
- Menampilkan flag emoji dan nama bahasa
- Loading dan error states
- Menampilkan "(Default)" untuk bahasa default

### 4. Database Schema

**Table:** `languages`

- `id`: Language code (e.g., "en", "id")
- `name`: Display name (e.g., "English", "Bahasa Indonesia")
- `flag`: Flag emoji (e.g., "🇺🇸", "🇮🇩")
- `isDefault`: Boolean untuk bahasa default
- `isActive`: Boolean untuk bahasa aktif

## Features

### ✅ Dynamic Language Loading

- Bahasa diambil dari database, bukan hardcoded
- Hanya menampilkan bahasa dengan `isActive: true`

### ✅ Visual Enhancements

- Flag emoji untuk setiap bahasa
- Indikator "(Default)" untuk bahasa default
- Loading state saat fetch data
- Error handling

### ✅ Admin Control

- Admin bisa mengaktifkan/nonaktifkan bahasa
- Admin bisa mengubah bahasa default
- Perubahan langsung terlihat di frontend

## Usage

### Basic Usage

```tsx
import { LanguageSwitcher } from "@/components/public/LanguageSwitcher";

<LanguageSwitcher currentLanguage="en" />;
```

### Admin Management

Admin bisa mengelola bahasa melalui:

- `/admin/settings` - Interface untuk mengelola bahasa
- API `/api/admin/languages` - CRUD operations

## API Endpoints

### Public API

- `GET /api/public/languages` - Get active languages

### Admin API

- `GET /api/admin/languages` - Get all languages (with filters)
- `POST /api/admin/languages` - Create new language
- `PUT /api/admin/languages/[id]` - Update language
- `DELETE /api/admin/languages/[id]` - Delete language

## Database Seeding

Script untuk menambahkan bahasa contoh:

```bash
npx tsx scripts/seed-languages.ts
```

## Benefits

1. **Flexible**: Admin bisa menambah/menghapus bahasa tanpa code changes
2. **User-friendly**: Visual indicators dengan flag dan status
3. **Performance**: Caching dengan React hooks
4. **Maintainable**: Separation of concerns dengan custom hooks
5. **Scalable**: Easy to add new languages via admin interface
