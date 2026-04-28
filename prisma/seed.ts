// prisma/seed.ts
import { PageType, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const worldLanguages = [
  // Major World Languages
  { id: "en", name: "English", flag: "🇺🇸", isDefault: true, isActive: true },
  {
    id: "id",
    name: "Indonesia",
    flag: "🇮🇩",
    isDefault: false,
    isActive: false,
  },
  {
    id: "zh",
    name: "Chinese (Mandarin)",
    flag: "🇨🇳",
    isDefault: false,
    isActive: false,
  },
  { id: "hi", name: "Hindi", flag: "🇮🇳", isDefault: false, isActive: false },
  { id: "es", name: "Spanish", flag: "🇪🇸", isDefault: false, isActive: false },
  { id: "ar", name: "Arabic", flag: "🇸🇦", isDefault: false, isActive: false },
  {
    id: "pt",
    name: "Portuguese",
    flag: "🇵🇹",
    isDefault: false,
    isActive: false,
  },
  { id: "ru", name: "Russian", flag: "🇷🇺", isDefault: false, isActive: false },
  { id: "ja", name: "Japanese", flag: "🇯🇵", isDefault: false, isActive: false },
  { id: "fr", name: "French", flag: "🇫🇷", isDefault: false, isActive: false },
  { id: "de", name: "German", flag: "🇩🇪", isDefault: false, isActive: false },
  { id: "ko", name: "Korean", flag: "🇰🇷", isDefault: false, isActive: false },
  { id: "tr", name: "Turkish", flag: "🇹🇷", isDefault: false, isActive: false },
  { id: "it", name: "Italian", flag: "🇮🇹", isDefault: false, isActive: false },
  { id: "th", name: "Thai", flag: "🇹🇭", isDefault: false, isActive: false },
  {
    id: "vi",
    name: "Vietnamese",
    flag: "🇻🇳",
    isDefault: false,
    isActive: false,
  },
  { id: "pl", name: "Polish", flag: "🇵🇱", isDefault: false, isActive: false },
  { id: "nl", name: "Dutch", flag: "🇳🇱", isDefault: false, isActive: false },
  {
    id: "uk",
    name: "Ukrainian",
    flag: "🇺🇦",
    isDefault: false,
    isActive: false,
  },
  { id: "fa", name: "Persian", flag: "🇮🇷", isDefault: false, isActive: false },

  // Africa
  {
    id: "af",
    name: "Afrikaans",
    flag: "🇿🇦",
    isDefault: false,
    isActive: false,
  },
  { id: "am", name: "Amharic", flag: "🇪🇹", isDefault: false, isActive: false },
  { id: "sw", name: "Swahili", flag: "🇰🇪", isDefault: false, isActive: false },
  { id: "ha", name: "Hausa", flag: "🇳🇬", isDefault: false, isActive: false },
  { id: "yo", name: "Yoruba", flag: "🇳🇬", isDefault: false, isActive: false },
  { id: "ig", name: "Igbo", flag: "🇳🇬", isDefault: false, isActive: false },
  { id: "zu", name: "Zulu", flag: "🇿🇦", isDefault: false, isActive: false },
  { id: "xh", name: "Xhosa", flag: "🇿🇦", isDefault: false, isActive: false },
  { id: "so", name: "Somali", flag: "🇸🇴", isDefault: false, isActive: false },
  {
    id: "rw",
    name: "Kinyarwanda",
    flag: "🇷🇼",
    isDefault: false,
    isActive: false,
  },
  { id: "mg", name: "Malagasy", flag: "🇲🇬", isDefault: false, isActive: false },

  // Europe
  { id: "sv", name: "Swedish", flag: "🇸🇪", isDefault: false, isActive: false },
  {
    id: "no",
    name: "Norwegian",
    flag: "🇳🇴",
    isDefault: false,
    isActive: false,
  },
  { id: "da", name: "Danish", flag: "🇩🇰", isDefault: false, isActive: false },
  { id: "fi", name: "Finnish", flag: "🇫🇮", isDefault: false, isActive: false },
  { id: "cs", name: "Czech", flag: "🇨🇿", isDefault: false, isActive: false },
  { id: "sk", name: "Slovak", flag: "🇸🇰", isDefault: false, isActive: false },
  {
    id: "hu",
    name: "Hungarian",
    flag: "🇭🇺",
    isDefault: false,
    isActive: false,
  },
  { id: "ro", name: "Romanian", flag: "🇷🇴", isDefault: false, isActive: false },
  {
    id: "bg",
    name: "Bulgarian",
    flag: "🇧🇬",
    isDefault: false,
    isActive: false,
  },
  { id: "hr", name: "Croatian", flag: "🇭🇷", isDefault: false, isActive: false },
  { id: "sr", name: "Serbian", flag: "🇷🇸", isDefault: false, isActive: false },
  { id: "bs", name: "Bosnian", flag: "🇧🇦", isDefault: false, isActive: false },
  {
    id: "sl",
    name: "Slovenian",
    flag: "🇸🇮",
    isDefault: false,
    isActive: false,
  },
  {
    id: "mk",
    name: "Macedonian",
    flag: "🇲🇰",
    isDefault: false,
    isActive: false,
  },
  { id: "sq", name: "Albanian", flag: "🇦🇱", isDefault: false, isActive: false },
  { id: "el", name: "Greek", flag: "🇬🇷", isDefault: false, isActive: false },
  { id: "mt", name: "Maltese", flag: "🇲🇹", isDefault: false, isActive: false },
  {
    id: "is",
    name: "Icelandic",
    flag: "🇮🇸",
    isDefault: false,
    isActive: false,
  },
  { id: "ga", name: "Irish", flag: "🇮🇪", isDefault: false, isActive: false },
  { id: "cy", name: "Welsh", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", isDefault: false, isActive: false },
  { id: "et", name: "Estonian", flag: "🇪🇪", isDefault: false, isActive: false },
  { id: "lv", name: "Latvian", flag: "🇱🇻", isDefault: false, isActive: false },
  {
    id: "lt",
    name: "Lithuanian",
    flag: "🇱🇹",
    isDefault: false,
    isActive: false,
  },
  {
    id: "be",
    name: "Belarusian",
    flag: "🇧🇾",
    isDefault: false,
    isActive: false,
  },
  { id: "md", name: "Moldovan", flag: "🇲🇩", isDefault: false, isActive: false },

  // Asia
  { id: "bn", name: "Bengali", flag: "🇧🇩", isDefault: false, isActive: false },
  { id: "ur", name: "Urdu", flag: "🇵🇰", isDefault: false, isActive: false },
  { id: "ta", name: "Tamil", flag: "🇱🇰", isDefault: false, isActive: false },
  { id: "si", name: "Sinhala", flag: "🇱🇰", isDefault: false, isActive: false },
  { id: "my", name: "Burmese", flag: "🇲🇲", isDefault: false, isActive: false },
  { id: "km", name: "Khmer", flag: "🇰🇭", isDefault: false, isActive: false },
  { id: "lo", name: "Lao", flag: "🇱🇦", isDefault: false, isActive: false },
  {
    id: "mn",
    name: "Mongolian",
    flag: "🇲🇳",
    isDefault: false,
    isActive: false,
  },
  { id: "ne", name: "Nepali", flag: "🇳🇵", isDefault: false, isActive: false },
  { id: "dz", name: "Dzongkha", flag: "🇧🇹", isDefault: false, isActive: false },
  { id: "ka", name: "Georgian", flag: "🇬🇪", isDefault: false, isActive: false },
  { id: "hy", name: "Armenian", flag: "🇦🇲", isDefault: false, isActive: false },
  {
    id: "az",
    name: "Azerbaijani",
    flag: "🇦🇿",
    isDefault: false,
    isActive: false,
  },
  { id: "kk", name: "Kazakh", flag: "🇰🇿", isDefault: false, isActive: false },
  { id: "ky", name: "Kyrgyz", flag: "🇰🇬", isDefault: false, isActive: false },
  { id: "tg", name: "Tajik", flag: "🇹🇯", isDefault: false, isActive: false },
  { id: "tk", name: "Turkmen", flag: "🇹🇲", isDefault: false, isActive: false },
  { id: "uz", name: "Uzbek", flag: "🇺🇿", isDefault: false, isActive: false },
  { id: "ps", name: "Pashto", flag: "🇦🇫", isDefault: false, isActive: false },
  { id: "he", name: "Hebrew", flag: "🇮🇱", isDefault: false, isActive: false },

  // Southeast Asia & Pacific
  { id: "ms", name: "Malay", flag: "🇲🇾", isDefault: false, isActive: false },
  { id: "tl", name: "Filipino", flag: "🇵🇭", isDefault: false, isActive: false },
  {
    id: "haw",
    name: "Hawaiian",
    flag: "🇺🇸",
    isDefault: false,
    isActive: false,
  },
  { id: "fj", name: "Fijian", flag: "🇫🇯", isDefault: false, isActive: false },
  { id: "sm", name: "Samoan", flag: "🇼🇸", isDefault: false, isActive: false },
  { id: "to", name: "Tongan", flag: "🇹🇴", isDefault: false, isActive: false },
  {
    id: "tvl",
    name: "Tuvaluan",
    flag: "🇹🇻",
    isDefault: false,
    isActive: false,
  },
  { id: "pau", name: "Palauan", flag: "🇵🇼", isDefault: false, isActive: false },
  {
    id: "mh",
    name: "Marshallese",
    flag: "🇲🇭",
    isDefault: false,
    isActive: false,
  },
  { id: "na", name: "Nauruan", flag: "🇳🇷", isDefault: false, isActive: false },

  // Americas
  { id: "qu", name: "Quechua", flag: "🇵🇪", isDefault: false, isActive: false },
  { id: "gn", name: "Guarani", flag: "🇵🇾", isDefault: false, isActive: false },
  { id: "ay", name: "Aymara", flag: "🇧🇴", isDefault: false, isActive: false },
  {
    id: "ht",
    name: "Haitian Creole",
    flag: "🇭🇹",
    isDefault: false,
    isActive: false,
  },

  // Middle East
  { id: "ku", name: "Kurdish", flag: "🇮🇶", isDefault: false, isActive: false },

  // African Countries (additional)
  { id: "sn", name: "Shona", flag: "🇿🇼", isDefault: false, isActive: false },
  { id: "ny", name: "Chichewa", flag: "🇲🇼", isDefault: false, isActive: false },
  { id: "ts", name: "Tsonga", flag: "🇿🇦", isDefault: false, isActive: false },
  { id: "ve", name: "Venda", flag: "🇿🇦", isDefault: false, isActive: false },
  { id: "ss", name: "Swati", flag: "🇸🇿", isDefault: false, isActive: false },
  { id: "st", name: "Sotho", flag: "🇱🇸", isDefault: false, isActive: false },
  { id: "tn", name: "Tswana", flag: "🇧🇼", isDefault: false, isActive: false },
  {
    id: "nd",
    name: "Northern Ndebele",
    flag: "🇿🇼",
    isDefault: false,
    isActive: false,
  },
  { id: "ti", name: "Tigrinya", flag: "🇪🇷", isDefault: false, isActive: false },
  { id: "om", name: "Oromo", flag: "🇪🇹", isDefault: false, isActive: false },

  // Additional Pacific Languages
  { id: "bi", name: "Bislama", flag: "🇻🇺", isDefault: false, isActive: false },
  {
    id: "ho",
    name: "Hiri Motu",
    flag: "🇵🇬",
    isDefault: false,
    isActive: false,
  },
  {
    id: "tpi",
    name: "Tok Pisin",
    flag: "🇵🇬",
    isDefault: false,
    isActive: false,
  },

  // Additional European Languages
  {
    id: "lb",
    name: "Luxembourgish",
    flag: "🇱🇺",
    isDefault: false,
    isActive: false,
  },
  { id: "rm", name: "Romansh", flag: "🇨🇭", isDefault: false, isActive: false },
  {
    id: "se",
    name: "Northern Sami",
    flag: "🇳🇴",
    isDefault: false,
    isActive: false,
  },
  { id: "fo", name: "Faroese", flag: "🇫🇴", isDefault: false, isActive: false },
  {
    id: "kl",
    name: "Greenlandic",
    flag: "🇬🇱",
    isDefault: false,
    isActive: false,
  },

  // Additional Asian Languages
  { id: "ug", name: "Uyghur", flag: "🇨🇳", isDefault: false, isActive: false },
  { id: "bo", name: "Tibetan", flag: "🇨🇳", isDefault: false, isActive: false },
  {
    id: "ii",
    name: "Sichuan Yi",
    flag: "🇨🇳",
    isDefault: false,
    isActive: false,
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Create languages first
  console.log("📝 Creating languages...");

  // Seed all world languages
  for (const language of worldLanguages) {
    await prisma.language.upsert({
      where: { id: language.id },
      update: {
        name: language.name,
        flag: language.flag,
        isDefault: language.isDefault,
        isActive: language.isActive,
      },
      create: {
        id: language.id,
        name: language.name,
        flag: language.flag,
        isDefault: language.isDefault,
        isActive: language.isActive,
      },
    });
  }

  console.log(`✅ Successfully seeded ${worldLanguages.length} languages`);

  // Create admin user (will be used for NextAuth)
  console.log("👤 Creating admin user...");
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@turningtidesfacility.org" },
    update: {},
    create: {
      email: "admin@turningtidesfacility.org",
      name: "Admin User",
      role: "SUPER_ADMIN",
      password: await bcrypt.hash("123456", 10),
      emailVerified: new Date(),
    },
  });

  console.log("🏷️ Creating tags...");
  const tags = [
    "Marine Conservation",
    "Sustainable Fishing",
    "Climate Change",
    "Community Rights",
    "Ocean Protection",
    "Fisheries Management",
    "Environmental Policy",
    "Coastal Communities",
    "Indigenous Rights",
    "Blue Economy",
  ];

  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
  }

  // Create categories with hierarchy
  console.log("📂 Creating categories...");
  const aboutCategory = await prisma.category.upsert({
    where: { slug: "about" },
    update: {
      order: 1,
      translations: {
        deleteMany: {},
        create: [
          {
            name: "About Us",
            description: "Information about Turning Tides Facility",
            languageId: "en",
          },
          {
            name: "Tentang Kami",
            description: "Informasi tentang Fasilitas Turning Tides",
            languageId: "id",
          },
        ],
      },
    },
    create: {
      slug: "about",
      order: 1,
      translations: {
        create: [
          {
            name: "About Us",
            description: "Information about Turning Tides Facility",
            languageId: "en",
          },
          {
            name: "Tentang Kami",
            description: "Informasi tentang Fasilitas Turning Tides",
            languageId: "id",
          },
        ],
      },
    },
  });

  const servicesCategory = await prisma.category.upsert({
    where: { slug: "services" },
    update: {
      order: 2,
      translations: {
        deleteMany: {},
        create: [
          {
            name: "Services",
            description: "Our rehabilitation and treatment services",
            languageId: "en",
          },
          {
            name: "Layanan",
            description: "Layanan rehabilitasi dan perawatan kami",
            languageId: "id",
          },
        ],
      },
    },
    create: {
      slug: "services",
      order: 2,
      translations: {
        create: [
          {
            name: "Services",
            description: "Our rehabilitation and treatment services",
            languageId: "en",
          },
          {
            name: "Layanan",
            description: "Layanan rehabilitasi dan perawatan kami",
            languageId: "id",
          },
        ],
      },
    },
  });

  // Create subcategories
  const programsCategory = await prisma.category.upsert({
    where: { slug: "programs" },
    update: {
      parentId: servicesCategory.id,
      order: 1,
      translations: {
        deleteMany: {},
        create: [
          {
            name: "Treatment Programs",
            description: "Various treatment and therapy programs",
            languageId: "en",
          },
          {
            name: "Program Perawatan",
            description: "Berbagai program perawatan dan terapi",
            languageId: "id",
          },
        ],
      },
    },
    create: {
      slug: "programs",
      parentId: servicesCategory.id,
      order: 1,
      translations: {
        create: [
          {
            name: "Treatment Programs",
            description: "Various treatment and therapy programs",
            languageId: "en",
          },
          {
            name: "Program Perawatan",
            description: "Berbagai program perawatan dan terapi",
            languageId: "id",
          },
        ],
      },
    },
  });

  const facilitiesCategory = await prisma.category.upsert({
    where: { slug: "facilities" },
    update: {
      parentId: servicesCategory.id,
      order: 2,
      translations: {
        deleteMany: {},
        create: [
          {
            name: "Facilities",
            description: "Our modern facilities and amenities",
            languageId: "en",
          },
          {
            name: "Fasilitas",
            description: "Fasilitas dan amenitas modern kami",
            languageId: "id",
          },
        ],
      },
    },
    create: {
      slug: "facilities",
      parentId: servicesCategory.id,
      order: 2,
      translations: {
        create: [
          {
            name: "Facilities",
            description: "Our modern facilities and amenities",
            languageId: "en",
          },
          {
            name: "Fasilitas",
            description: "Fasilitas dan amenitas modern kami",
            languageId: "id",
          },
        ],
      },
    },
  });

  // Create sample articles
  console.log("📄 Creating sample articles...");
  await prisma.article.upsert({
    where: { slug: "welcome-to-turning-tides" },
    update: {},
    create: {
      slug: "welcome-to-turning-tides",
      title: "Welcome to Turning Tides Facility",
      content: `
        <h2>A New Beginning</h2>
        <p>Welcome to Turning Tides Facility, where healing begins and hope is restored. Our state-of-the-art rehabilitation center provides comprehensive care in a supportive environment.</p>
        
        <h3>Our Mission</h3>
        <p>We are dedicated to helping individuals overcome addiction and mental health challenges through evidence-based treatment programs and compassionate care.</p>
        
        <h3>What We Offer</h3>
        <ul>
          <li>Inpatient and outpatient programs</li>
          <li>Individual and group therapy</li>
          <li>Medical detoxification</li>
          <li>Family support services</li>
          <li>Aftercare planning</li>
        </ul>
      `,
      excerpt:
        "Discover Turning Tides Facility, where healing begins and hope is restored through comprehensive rehabilitation services.",
      status: "PUBLISHED",
      featuredImage: "/images/facility-exterior.jpg",
      publishedAt: new Date(),
      authorId: adminUser.id,
      translations: {
        create: [
          {
            title: "Welcome to Turning Tides Facility",
            excerpt:
              "Discover Turning Tides Facility, where healing begins and hope is restored through comprehensive rehabilitation services.",
            seoTitle:
              "Welcome to Turning Tides - Premier Rehabilitation Facility",
            seoDescription:
              "Turning Tides Facility offers comprehensive addiction and mental health treatment with evidence-based programs and compassionate care.",
            languageId: "en",
          },
          {
            title: "Selamat Datang di Fasilitas Turning Tides",
            excerpt:
              "Temukan Fasilitas Turning Tides, tempat penyembuhan dimulai dan harapan dipulihkan melalui layanan rehabilitasi komprehensif.",
            seoTitle:
              "Selamat Datang di Turning Tides - Fasilitas Rehabilitasi Terbaik",
            seoDescription:
              "Fasilitas Turning Tides menawarkan perawatan kecanduan dan kesehatan mental komprehensif dengan program berbasis bukti dan perawatan penuh kasih.",
            languageId: "id",
          },
        ],
      },
      categories: {
        create: [{ categoryId: aboutCategory.id }],
      },
    },
  });

  // Create navigation menus
  console.log("🧭 Creating navigation menus...");
  const mainMenu = await prisma.menu.upsert({
    where: { key: "main-navigation" },
    update: {
      name: "Main Navigation",
    },
    create: {
      key: "main-navigation",
      name: "Main Navigation",
    },
  });

  const footerMenu = await prisma.menu.upsert({
    where: { key: "footer-links" },
    update: {
      name: "Footer Links",
    },
    create: {
      key: "footer-links",
      name: "Footer Links",
    },
  });

  // Delete existing menu items to avoid duplicates
  await prisma.menuItem.deleteMany({
    where: { menuId: { in: [mainMenu.id, footerMenu.id] } },
  });

  // Create main navigation items
  await prisma.menuItem.create({
    data: {
      menuId: mainMenu.id,
      order: 1,
      url: "/",
      type: "HOME",
      translations: {
        create: [
          { title: "Home", languageId: "en" },
          { title: "Beranda", languageId: "id" },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      menuId: mainMenu.id,
      order: 2,
      type: "CATEGORY",
      articleCategoryId: aboutCategory.id,
      translations: {
        create: [
          { title: "About Us", languageId: "en" },
          { title: "Tentang Kami", languageId: "id" },
        ],
      },
    },
  });

  const servicesMenuItem = await prisma.menuItem.create({
    data: {
      menuId: mainMenu.id,
      order: 3,
      type: "CATEGORY",
      articleCategoryId: servicesCategory.id,
      translations: {
        create: [
          { title: "Services", languageId: "en" },
          { title: "Layanan", languageId: "id" },
        ],
      },
    },
  });

  // Create submenu items for services
  await prisma.menuItem.create({
    data: {
      menuId: mainMenu.id,
      parentId: servicesMenuItem.id,
      order: 1,
      type: "CATEGORY",
      articleCategoryId: programsCategory.id,
      translations: {
        create: [
          { title: "Treatment Programs", languageId: "en" },
          { title: "Program Perawatan", languageId: "id" },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      menuId: mainMenu.id,
      parentId: servicesMenuItem.id,
      order: 2,
      type: "CATEGORY",
      articleCategoryId: facilitiesCategory.id,
      translations: {
        create: [
          { title: "Facilities", languageId: "en" },
          { title: "Fasilitas", languageId: "id" },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      menuId: mainMenu.id,
      order: 4,
      url: "/contact",
      type: "CUSTOM",
      translations: {
        create: [
          { title: "Contact", languageId: "en" },
          { title: "Kontak", languageId: "id" },
        ],
      },
    },
  });

  // Create footer menu items
  await prisma.menuItem.create({
    data: {
      menuId: footerMenu.id,
      order: 1,
      url: "/privacy-policy",
      type: "CUSTOM",
      translations: {
        create: [
          { title: "Privacy Policy", languageId: "en" },
          { title: "Kebijakan Privasi", languageId: "id" },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      menuId: footerMenu.id,
      order: 2,
      url: "/terms-of-service",
      type: "CUSTOM",
      translations: {
        create: [
          { title: "Terms of Service", languageId: "en" },
          { title: "Syarat Layanan", languageId: "id" },
        ],
      },
    },
  });

  // Create site settings
  console.log("⚙️ Creating site settings...");
  const siteSettings = [
    {
      key: "site_name",
      value: "Turning Tides Facility",
      type: "TEXT" as const,
    },
    {
      key: "site_description",
      value: "Premier rehabilitation and treatment facility",
      type: "TEXT" as const,
    },
    { key: "contact_phone", value: "+1-555-0123", type: "TEXT" as const },
    {
      key: "contact_email",
      value: "info@turningtidesfacility.org",
      type: "TEXT" as const,
    },
    {
      key: "address",
      value: "123 Recovery Lane, Hope City, HC 12345",
      type: "TEXT" as const,
    },
    {
      key: "social_facebook",
      value: "https://facebook.com/turningtidesfacility",
      type: "TEXT" as const,
    },
    {
      key: "social_twitter",
      value: "https://twitter.com/turningtides",
      type: "TEXT" as const,
    },
    {
      key: "social_instagram",
      value: "https://instagram.com/turningtidesfacility",
      type: "TEXT" as const,
    },
    { key: "google_analytics_id", value: "", type: "TEXT" as const },
    { key: "maintenance_mode", value: "false", type: "BOOLEAN" as const },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        type: setting.type,
      },
      create: setting,
    });
  }

  console.log("📄 Creating default pages...");

  const defaultPages = [
    {
      slug: "home",
      pageType: "HOME",
      translations: [
        {
          title: "Welcome to Turning Tides",
          excerpt: "Premier rehabilitation facility",
          languageId: "en",
        },
      ],
    },
    {
      slug: "about-us",
      pageType: "ABOUT_US",
      translations: [
        {
          title: "About Us",
          excerpt: "Learn about our mission",
          languageId: "en",
        },
      ],
    },
    {
      slug: "our-work",
      pageType: "OUR_WORK",
      translations: [
        {
          title: "Our Work",
          excerpt: "Our programs and impact",
          languageId: "en",
        },
      ],
    },
    {
      slug: "governance",
      pageType: "GOVERNANCE",
      translations: [
        {
          title: "Governance",
          excerpt: "Governance and policies",
          languageId: "en",
        },
      ],
    },
    {
      slug: "stories",
      pageType: "STORIES",
      translations: [
        {
          title: "Stories",
          excerpt: "Inspiring recovery stories",
          languageId: "en",
        },
      ],
    },
    {
      slug: "get-involved",
      pageType: "GET_INVOLVED",
      translations: [
        {
          title: "Get Involved",
          excerpt: "Join our mission",
          languageId: "en",
        },
      ],
    },
  ];

  for (const pageData of defaultPages) {
    // Delete existing translations first to avoid conflicts
    const existingPage = await prisma.page.findUnique({
      where: { slug: pageData.slug },
      include: { translations: true },
    });

    if (existingPage) {
      await prisma.pageTranslation.deleteMany({
        where: { pageId: existingPage.id },
      });
    }

    await prisma.page.upsert({
      where: { slug: pageData.slug },
      update: {
        pageType: pageData.pageType as PageType,
        status: "PUBLISHED",
        publishedAt: new Date(),
        translations: {
          create: pageData.translations,
        },
      },
      create: {
        slug: pageData.slug,
        pageType: pageData.pageType as PageType,
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorId: adminUser.id,
        translations: {
          create: pageData.translations,
        },
      },
    });
  }

  console.log(`✅ Created ${defaultPages.length} default pages`);

  await prisma.footerBrand.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      mainLogoSrc: "/assets/Logo-white.png",
      mainLogoAlt: "Turning Tides Logo",
      mainLogoHref: "/",
      sponsorLogoSrc: "/assets/Logo-TenureFacility.png",
      sponsorLogoAlt: "Tenure Facility Logo",
      sponsorshipParagraph:
        "Turning Tides is a fiscally sponsored project of the Tenure Facility Fund, a US 501(c)3, which is a Not-for-profit subsidiary of the International Land and Forest Tenure Facility.",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log(`
    📊 Created:
    - ${worldLanguages.length} languages (from ${worldLanguages.length} countries)
    - 1 admin user
    - 4 categories (with hierarchy)
    - 1 sample article (bilingual)
    - 2 menus (main navigation, footer)
    - 7 menu items (with nested structure)
    - 3 site content items
    - 10 site settings
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
