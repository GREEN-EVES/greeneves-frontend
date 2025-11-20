import DesignGallery from '@/components/DesignGallery';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Browse Templates - Green Eves',
  description: 'Choose from our collection of beautiful event templates for weddings and birthdays',
};

export default function DesignsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#7c8925] to-[#6a7520] text-white py-16 px-4 mt-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Perfect Template
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Select from our beautiful collection of event templates designed for weddings and birthdays
          </p>
        </div>
      </section>

      {/* Gallery */}
      <DesignGallery />

      {/* Footer */}
      <Footer />
    </div>
  );
}
