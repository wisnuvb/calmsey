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
npx prisma generate

# 4. Rebuild aplikasi
npm run build
# atau
yarn build

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
npm cache clean --force
# atau
yarn cache clean

# 4. Reinstall dependencies (jika perlu)
npm install
# atau
yarn install

# 5. Generate Prisma Client
npx prisma generate

# 6. Rebuild aplikasi
npm run build

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
npx prisma generate

echo "Rebuilding application..."
npm run build

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
   npm install
   npm run build
   pm2 restart turningtidesfacility
   ```

2. **Gunakan script release yang sudah ada:**

   ```bash
   npm run release
   ```

3. **Pastikan `.next` folder di-ignore di git** (sudah ada di `.gitignore`)

## Catatan

- Error ini biasanya terjadi setelah update Next.js atau perubahan besar di routing
- Pastikan semua environment variables sudah di-set dengan benar
- Pastikan database connection sudah benar sebelum rebuild
