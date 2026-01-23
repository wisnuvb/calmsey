# Fund Details Setup Guide

## Masalah: 404 Error pada `/en/our-fund/grassroot`

Jika halaman fund detail menampilkan error 404, kemungkinan data fund belum ada di database.

## Solusi: Menambahkan Data Fund ke Database

Fund details disimpan di **Page Content** dengan `pageType: "OUR_FUND"`. 

### Langkah-langkah:

1. **Buka Admin Panel**
   - Akses: `http://localhost:3005/admin/page-content/OUR_FUND`
   - Atau: `http://localhost:3005/admin/pages` → Cari page dengan type "OUR_FUND"

2. **Tambahkan Content Keys**

   Untuk setiap fund, tambahkan 3 keys:

   **a. Fund ID (Optional)**
   - Key: `fund.{slug}.id`
   - Value: ID fund (contoh: `grassroot-fund`)
   - Type: `text`

   **b. Fund Header (Required)**
   - Key: `fund.{slug}.header`
   - Value: JSON string untuk header
   - Type: `json` atau `textarea`
   
   Contoh untuk `fund.grassroot.header`:
   ```json
   {
     "smallHeading": "OUR FOUR GRANTMAKING FUNDS",
     "title": "Grassroot Fund",
     "subtitle": "Turning Tides deploys the majority of its resources through the Grassroots Fund supporting actions at regional, national, and local levels.",
     "heroImage": {
       "src": "/assets/demo/f2646a1a9178debf7cb5581694b906ba8af3d607.png",
       "alt": "People drying fish on racks"
     }
   }
   ```

   **c. Fund Content (Required)**
   - Key: `fund.{slug}.content`
   - Value: JSON string untuk content
   - Type: `json` atau `textarea`
   
   Contoh untuk `fund.grassroot.content` (type: `supported-unsupported`):
   ```json
   {
     "type": "supported-unsupported",
     "intro": [
       "Funding from the Grassroot Fund will be available to existing partners..."
     ],
     "supportedSection": {
       "title": "The Grassroot Fund will support work in the following categories:",
       "items": [
         {
           "id": "1",
           "icon": "check",
           "title": "Category 1",
           "description": "Description 1"
         }
       ]
     },
     "unsupportedSection": {
       "title": "The Grassroot Fund will NOT support:",
       "items": [
         {
           "id": "1",
           "icon": "x",
           "description": "Not supported item"
         }
       ]
     },
     "cta": {
       "type": "button",
       "text": "Apply Now",
       "link": "/apply",
       "style": "primary"
     }
   }
   ```

3. **Slug yang Didukung**

   Berdasarkan data dummy, slug yang didukung:
   - `grassroot` → `/en/our-fund/grassroot`
   - `civic-space` → `/en/our-fund/civic-space`
   - `rapid-response` → `/en/our-fund/rapid-response`
   - `knowledge-action` → `/en/our-fund/knowledge-action`

## Debug

Jika masih error 404, cek:

1. **Cek Console Logs**
   - Buka terminal server
   - Lihat log untuk pesan: `Looking for fund keys: fund.grassroot.header`
   - Lihat log untuk: `Available keys in content:`

2. **Cek API Endpoint**
   - Akses: `http://localhost:3005/api/public/page-content/OUR_FUND?language=en`
   - Pastikan ada keys yang dimulai dengan `fund.grassroot.`

3. **Cek Database**
   - Pastikan ada page dengan `pageType = "OUR_FUND"`
   - Pastikan ada translation untuk language yang diminta
   - Pastikan ada pageContent dengan key yang sesuai

## Migration dari JSON ke Database

Jika ingin migrate data dari `fund-details.json` ke database, gunakan script migration atau tambahkan manual melalui admin panel.
