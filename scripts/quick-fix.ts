/**
 * QUICK FIX SCRIPT
 * Run this to fix immediate issues in your development environment
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function quickFix() {
  console.log('🔧 Running quick fixes...\n');

  // Fix 1: Ensure languages exist
  console.log('1️⃣ Seeding languages...');
  const languages = [
    { id: 'en', name: 'English', flag: '🇺🇸', isDefault: true, isActive: true },
    { id: 'id', name: 'Indonesia', flag: '🇮🇩', isDefault: false, isActive: true },
    { id: 'zh', name: 'Chinese (Mandarin)', flag: '🇨🇳', isDefault: false, isActive: false },
  ];

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { id: lang.id },
      update: lang,
      create: lang,
    });
  }
  console.log(`✅ ${languages.length} languages seeded\n`);

  // Fix 2: Ensure admin user exists
  console.log('2️⃣ Creating admin user...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@turningtidesfacility.org' },
    update: {},
    create: {
      email: 'admin@turningtidesfacility.org',
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      password: await bcrypt.hash('admin123', 10),
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Admin user created: ${admin.email}\n`);

  // Fix 3: Check for schema compatibility issues
  console.log('3️⃣ Checking schema...');
  const pageTranslation = await prisma.pageTranslation.findFirst();
  if (pageTranslation) {
    console.log('✅ PageTranslation table exists');
    console.log(`   Fields: id, title, excerpt, seoTitle, seoDescription, slug`);
    console.log(`   ⚠️  Note: 'content' field has been removed (hybrid approach)`);
  }
  console.log();

  // Fix 4: Migrate any existing page translations content
  console.log('4️⃣ Checking for data migration needs...');
  const pagesWithTranslations = await prisma.page.count({
    where: {
      translations: {
        some: {},
      },
    },
  });
  console.log(`   Found ${pagesWithTranslations} pages with translations`);
  console.log(`   ⚠️  If you had content in old schema, you need to run full migration`);
  console.log();

  console.log('✅ Quick fix completed!\n');
  console.log('📝 Next steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Login with: admin@turningtidesfacility.org / admin123');
  console.log('   3. Test creating new articles/pages');
  console.log('   4. Use /admin/page-content for headless CMS');
  console.log();
}

quickFix()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
