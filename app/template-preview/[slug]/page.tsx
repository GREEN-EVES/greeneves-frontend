import { notFound } from 'next/navigation';
import { getTemplateComponent, getTemplateMetadata } from '@/components/event-templates/registry';
import { getDummyDataByEventType } from '@/components/event-templates/dummy-data';
import Link from 'next/link';

export default function TemplatePreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  // Get template metadata from registry
  const template = getTemplateMetadata(params.slug);

  if (!template) {
    notFound();
  }

  // Get the template component
  const TemplateComponent = getTemplateComponent(template.componentPath);

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Template Not Available
          </h1>
          <p className="text-gray-600">
            The template component could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  // Get dummy data based on event type
  const dummyEvent = getDummyDataByEventType(template.eventType);

  // Override template in dummy data to match current template
  const eventData = {
    ...dummyEvent,
    template: {
      id: template.id,
      name: template.name,
      slug: template.slug,
      componentPath: template.componentPath,
    },
  };

  return (
    <div className="relative">
      {/* Preview Banner - Fixed at top */}
      <div className="sticky top-0 z-50 bg-blue-600 text-white py-3 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">PREVIEW MODE</span>
            <span className="text-sm opacity-90">
              {template.name} Template • {template.eventType}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {template.isPremium && (
              <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                Premium - ₦{template.price.toLocaleString()}
              </span>
            )}
            {!template.isPremium && (
              <span className="bg-green-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                Free Template
              </span>
            )}
            <Link
              href="/template-preview"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
            >
              ← Back to Templates
            </Link>
          </div>
        </div>
      </div>

      {/* Render template with dummy data */}
      <TemplateComponent event={eventData} />

      {/* Footer Note */}
      <div className="bg-gray-900 text-white py-8 px-4 text-center">
        <p className="text-sm opacity-75 mb-2">
          This is a preview with sample data. Your actual event details will replace this content.
        </p>
        <Link
          href="/template-preview"
          className="text-blue-400 hover:text-blue-300 underline text-sm"
        >
          View all templates
        </Link>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const template = getTemplateMetadata(params.slug);

  if (!template) {
    return {
      title: 'Template Not Found',
    };
  }

  return {
    title: `${template.name} Template Preview - Green Eves`,
    description: template.description,
  };
}
