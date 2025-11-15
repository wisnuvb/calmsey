import { Metadata } from 'next';
import Link from 'next/link';
import { PageType } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Page Content Manager - Admin',
  description: 'Manage content for all pages',
};

const PAGE_TYPES = [
  {
    type: 'HOME' as PageType,
    name: 'Home Page',
    description: 'Main landing page with hero, sections, and latest articles',
    icon: '🏠',
  },
  {
    type: 'ABOUT_US' as PageType,
    name: 'About Us',
    description: 'Company information, vision, mission, and team',
    icon: 'ℹ️',
  },
  {
    type: 'OUR_WORK' as PageType,
    name: 'Our Work',
    description: 'Case studies, approach, and success stories',
    icon: '💼',
  },
  {
    type: 'GOVERNANCE' as PageType,
    name: 'Governance',
    description: 'Values, principles, funders, and committees',
    icon: '⚖️',
  },
  {
    type: 'GET_INVOLVED' as PageType,
    name: 'Get Involved',
    description: 'How to help and opportunities',
    icon: '🤝',
  },
  {
    type: 'CONTACT' as PageType,
    name: 'Contact',
    description: 'Contact information and office hours',
    icon: '📞',
  },
];

export default function PageContentManagerPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Page Content Manager
        </h1>
        <p className="text-gray-600">
          Edit content for your website pages. Changes will be reflected on the frontend immediately.
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              Headless CMS Approach
            </h3>
            <p className="text-sm text-blue-800">
              This system uses a headless CMS approach where the frontend design is controlled by developers,
              but content is fully editable by you through simple forms. No complex page builders needed!
            </p>
          </div>
        </div>
      </div>

      {/* Page Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PAGE_TYPES.map((page) => (
          <Link
            key={page.type}
            href={`/admin/page-content/${page.type.toLowerCase()}`}
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-300 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{page.icon}</div>
              <div className="px-2 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded">
                {page.type}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {page.name}
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              {page.description}
            </p>

            <div className="flex items-center text-blue-600 text-sm font-medium">
              Edit Content
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/articles"
            className="flex items-center p-3 bg-white border border-gray-200 rounded hover:border-blue-300"
          >
            <svg
              className="w-5 h-5 text-gray-600 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div>
              <div className="font-medium text-gray-900">Articles</div>
              <div className="text-xs text-gray-500">Manage blog posts and case studies</div>
            </div>
          </Link>

          <Link
            href="/admin/media"
            className="flex items-center p-3 bg-white border border-gray-200 rounded hover:border-blue-300"
          >
            <svg
              className="w-5 h-5 text-gray-600 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <div className="font-medium text-gray-900">Media Library</div>
              <div className="text-xs text-gray-500">Upload and manage images</div>
            </div>
          </Link>

          <Link
            href="/admin/menus"
            className="flex items-center p-3 bg-white border border-gray-200 rounded hover:border-blue-300"
          >
            <svg
              className="w-5 h-5 text-gray-600 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <div>
              <div className="font-medium text-gray-900">Menus</div>
              <div className="text-xs text-gray-500">Manage navigation menus</div>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center p-3 bg-white border border-gray-200 rounded hover:border-blue-300"
          >
            <svg
              className="w-5 h-5 text-gray-600 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <div className="font-medium text-gray-900">Settings</div>
              <div className="text-xs text-gray-500">Configure site settings</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
