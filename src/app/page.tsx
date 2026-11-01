import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { DemoShowcase } from '@/components/DemoShowcase';
import { CaraKerja } from '@/components/CaraKerja';
import { Faq } from '@/components/Faq';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { ConsultationModal } from '@/components/ConsultationModal';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <DemoShowcase />
        <CaraKerja />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <ConsultationModal />
    </div>
  );
}
