import Link from "next/link";
import { PublicMenuItem, SupportedLanguage } from "@/lib/public-api";

interface NavigationProps {
  items: PublicMenuItem[];
  language: SupportedLanguage;
}

export function Navigation({ items, language }: NavigationProps) {
  return (
    <nav className="flex space-x-8">
      {items.map((item) => (
        <NavigationItem key={item.id} item={item} language={language} />
      ))}
    </nav>
  );
}

function NavigationItem({
  item,
  language,
}: {
  item: PublicMenuItem;
  language: SupportedLanguage;
}) {
  const href = getMenuItemUrl(item, language);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div className="relative group">
        <button className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium flex items-center">
          {item.title}
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown */}
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <div className="py-1">
            {item.children?.map((child) => (
              <Link
                key={child.id}
                href={getMenuItemUrl(child, language)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {child.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
    >
      {item.title}
    </Link>
  );
}

function getMenuItemUrl(
  item: PublicMenuItem,
  language: SupportedLanguage
): string {
  const prefix = language === "en" ? "" : `/${language}`;

  if (item.url) {
    // External or custom URL
    if (item.url.startsWith("http") || item.url.startsWith("/")) {
      return item.url;
    }
    return `${prefix}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
  }

  if (item.type === "HOME") {
    return prefix || "/";
  }

  if (item.type === "CATEGORY" && item.categorySlug) {
    return `${prefix}/${item.categorySlug}`;
  }

  return "#";
}
