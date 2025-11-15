import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageType } from '@prisma/client';
import { PageContentEditor } from '@/components/admin/PageContentEditor';

interface PageProps {
  params: {
    pageType: string;
  };
}

// Validate page type
const VALID_PAGE_TYPES = Object.values(PageType);

function isValidPageType(type: string): type is PageType {
  return VALID_PAGE_TYPES.includes(type.toUpperCase() as PageType);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pageType = params.pageType.toUpperCase();

  if (!isValidPageType(pageType)) {
    return {
      title: 'Page Not Found',
    };
  }

  const pageName = pageType.replace(/_/g, ' ');

  return {
    title: `Edit ${pageName} - Page Content`,
    description: `Edit content for ${pageName} page`,
  };
}

export default function EditPageContentPage({ params }: PageProps) {
  const pageType = params.pageType.toUpperCase();

  // Validate page type
  if (!isValidPageType(pageType)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageContentEditor pageType={pageType as PageType} language="en" />
    </div>
  );
}
