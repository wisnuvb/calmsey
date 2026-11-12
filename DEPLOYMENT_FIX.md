# Fix: routesManifest.dataRoutes is not iterable

Error ini terjadi karena build cache yang corrupt atau build artifacts yang tidak lengkap.

## Solusi Cepat

Jalankan perintah berikut di server production:

```bash
# 1. Stop PM2
pm2 stop turningtidesfacility

# 2. Hapus .next folder (build cache)
cd /var/www/html/project/turningtidesfacility
rm -rf .next

# 3. Generate Prisma Client (jika perlu)
pnpm exec prisma generate

# 4. Rebuild aplikasi
pnpm build
# atau
pnpm build

# 5. Start PM2 lagi
pm2 start ecosystem.config.js
# atau
pm2 restart turningtidesfacility
```

## Solusi Lengkap (Jika masih error)

```bash
# 1. Stop PM2
pm2 stop turningtidesfacility

# 2. Hapus semua cache dan build artifacts
cd /var/www/html/project/turningtidesfacility
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

# 3. Clear npm/yarn cache (optional)
pnpm store prune
# atau
pnpm store prune

# 4. Reinstall dependencies (jika perlu)
pnpm install
# atau
pnpm install

# 5. Generate Prisma Client
pnpm exec prisma generate

# 6. Rebuild aplikasi
pnpm build

# 7. Start PM2
pm2 start ecosystem.config.js
```

## Script Otomatis

Buat file `fix-build.sh` di root project:

```bash
#!/bin/bash
echo "Stopping PM2..."
pm2 stop turningtidesfacility

echo "Cleaning build cache..."
cd /var/www/html/project/turningtidesfacility
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

echo "Generating Prisma Client..."
pnpm exec prisma generate

echo "Rebuilding application..."
pnpm build

echo "Starting PM2..."
pm2 start ecosystem.config.js

echo "Done! Check logs with: pm2 logs turningtidesfacility"
```

Jalankan dengan:

```bash
chmod +x fix-build.sh
./fix-build.sh
```

## Verifikasi

Setelah rebuild, cek apakah error sudah hilang:

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs turningtidesfacility --lines 50

# Check if app is running
curl http://localhost:2039
```

## Pencegahan

Untuk mencegah error ini di masa depan:

1. **Selalu rebuild setelah pull code baru:**

   ```bash
   git pull
   pnpm install
   pnpm build
   pm2 restart turningtidesfacility
   ```

2. **Gunakan script release yang sudah ada:**

   ```bash
   pnpm release
   ```

3. **Pastikan `.next` folder di-ignore di git** (sudah ada di `.gitignore`)

4. **Jika API public 500 (languages/footer) dan log berisi `must start with the protocol mysql://`:**
   PM2 mungkin menyuntikkan `DATABASE_URL` dari proyek lain (mis. PostgreSQL `supporter`), menimpa `.env` MySQL.

   ```bash
   cd /var/www/html/projects/turningtidesfacility
   grep '^DATABASE_URL=' .env   # harus mysql://...
   pm2 env 0 | grep DATABASE_URL  # jika postgresql://... → env tercemar

   # Perbaikan: hapus dump proses lama, start bersih
   pm2 delete turningtidesfacility
   pm2 start ecosystem.config.js --only turningtidesfacility
   pm2 save

   # Atau gunakan script (setelah di-pull ke server):
   bash scripts/pm2-ensure.sh
   ```

   Log aktual PM2: `logs/error-{pm_id}.log` (bukan `logs/error.log` literal).

## Catatan

- Error ini biasanya terjadi setelah update Next.js atau perubahan besar di routing
- Pastikan semua environment variables sudah di-set dengan benar
- Pastikan database connection sudah benar sebelum rebuild
