# MySQL Setup Guide

## 📋 Prerequisites

### 1. Install MySQL
- **macOS**: `brew install mysql`
- **Ubuntu/Debian**: `sudo apt install mysql-server`
- **Windows**: Download dari [MySQL Official Website](https://dev.mysql.com/downloads/mysql/)

### 2. Start MySQL Service
```bash
# macOS
brew services start mysql

# Ubuntu/Debian
sudo systemctl start mysql

# Windows
# Start dari MySQL Installer atau Services
```

### 3. Secure MySQL Installation
```bash
sudo mysql_secure_installation
```

## 🗄️ Database Setup

### 1. Login ke MySQL
```bash
mysql -u root -p
```

### 2. Buat Database
```sql
CREATE DATABASE turningtidesfacility CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Buat User (Opsional)
```sql
CREATE USER 'turningtides_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON turningtidesfacility.* TO 'turningtides_user'@'localhost';
FLUSH PRIVILEGES;
```

## 🔧 Environment Configuration

### 1. Update .env File
```env
# Database - MySQL
DATABASE_URL="mysql://username:password@localhost:3306/turningtidesfacility"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

### 2. Contoh DATABASE_URL
```env
# Menggunakan root user
DATABASE_URL="mysql://root:your_root_password@localhost:3306/turningtidesfacility"

# Menggunakan user khusus
DATABASE_URL="mysql://turningtides_user:your_secure_password@localhost:3306/turningtidesfacility"
```

## 🚀 Database Migration

### 1. Generate Prisma Client
```bash
npx prisma generate
```

### 2. Push Schema ke Database
```bash
npx prisma db push
```

### 3. Verifikasi Tabel
```bash
npx prisma studio
```

## 📊 Database Schema

Proyek ini menggunakan schema yang mencakup:

### NextAuth Tables
- `User` - User accounts
- `Account` - OAuth accounts
- `Session` - User sessions
- `VerificationToken` - Email verification

### CMS Tables
- `Language` - Multi-language support
- `Article` - Articles
- `ArticleTranslation` - Article translations
- `Category` - Categories
- `CategoryTranslation` - Category translations
- `SiteSetting` - Site configuration
- `SiteContent` - Static content
- `Media` - File management

## 🔍 Troubleshooting

### 1. Connection Error
```
Error: P1001: Can't reach database server
```
**Solution**: Pastikan MySQL service running
```bash
# macOS
brew services list | grep mysql

# Ubuntu/Debian
sudo systemctl status mysql
```

### 2. Authentication Error
```
Error: P1045: Access denied for user
```
**Solution**: Periksa username dan password di DATABASE_URL

### 3. Database Not Found
```
Error: P1003: Database does not exist
```
**Solution**: Buat database terlebih dahulu
```sql
CREATE DATABASE turningtidesfacility;
```

### 4. Character Set Error
```
Error: P1008: Operations were rejected
```
**Solution**: Gunakan UTF8MB4
```sql
ALTER DATABASE turningtidesfacility CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 🛠️ Development Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Reset database
npx prisma db push --force-reset

# Open Prisma Studio
npx prisma studio

# View database logs
npx prisma db pull

# Create migration (jika menggunakan migrations)
npx prisma migrate dev --name init
```

## 📝 Notes

1. **Port**: MySQL default port adalah 3306
2. **Character Set**: Gunakan UTF8MB4 untuk support emoji dan karakter khusus
3. **Timezone**: Pastikan timezone database sesuai dengan aplikasi
4. **Backup**: Selalu backup database sebelum melakukan perubahan besar
5. **Security**: Jangan gunakan root user untuk production

## 🔗 Useful Links

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Prisma MySQL Guide](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [NextAuth MySQL Setup](https://next-auth.js.org/adapters/prisma) 