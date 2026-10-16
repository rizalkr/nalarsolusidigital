import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { DemoShowcase } from '@/components/DemoShowcase';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <DemoShowcase />
      </main>
    </div>
  );
}
