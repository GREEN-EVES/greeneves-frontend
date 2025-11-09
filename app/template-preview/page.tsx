import Link from 'next/link';
import { TEMPLATE_REGISTRY } from '@/components/event-templates/registry';
import Image from 'next/image';

export const metadata = {
  title: 'Template Previews - Green Eves',
  description: 'Browse and preview event templates',
};

export default function TemplatePreviewPage() {
  const weddingTemplates = TEMPLATE_REGISTRY.filter(t => t.eventType === 'WEDDING');
  const birthdayTemplates = TEMPLATE_REGISTRY.filter(t => t.eventType === 'BIRTHDAY');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Template Previews
          </h1>
          <p className="text-lg text-gray-600">
            Preview our beautifully designed event templates with sample data
          </p>
        </div>

        {/* Wedding Templates */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Wedding Templates
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weddingTemplates.map((template) => (
              <Link
                key={template.id}
                href={`/template-preview/${template.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={template.previewImage}
                    alt={template.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {template.isPremium && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Premium
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      {template.isPremium
                        ? `₦${template.price.toLocaleString()}`
                        : 'Free'}
                    </span>
                    <span className="text-green-600 font-semibold group-hover:underline">
                      Preview →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Birthday Templates */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Birthday Templates
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {birthdayTemplates.map((template) => (
              <Link
                key={template.id}
                href={`/template-preview/${template.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={template.previewImage}
                    alt={template.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {template.isPremium && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Premium
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      {template.isPremium
                        ? `₦${template.price.toLocaleString()}`
                        : 'Free'}
                    </span>
                    <span className="text-green-600 font-semibold group-hover:underline">
                      Preview →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Developer Note */}
        <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Developer Note
          </h3>
          <p className="text-green-800">
            These previews use dummy data to showcase template designs. When users select a template,
            their actual event data will populate these designs.
          </p>
        </div>
      </div>
    </div>
  );
}
