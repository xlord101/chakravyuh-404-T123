import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { Navbar } from './components/Navbar';
import { HardwareHero } from './components/HardwareHero';
import { SponsorsAndPartners } from './components/SponsorsAndPartners';
import { EventCatalog } from './components/EventCatalog';
import { ScheduleMatrix } from './components/ScheduleMatrix';
import { RegistrationPortal } from './components/RegistrationPortal';
import { DepartmentShowcase } from './components/DepartmentShowcase';
import { FaqSection } from './components/FaqSection';
import { FooterAndVenue } from './components/FooterAndVenue';
import './index.css';

function App() {
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Tactical Header Navigation */}
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* 1. Interactive 240-Frame 3D Exploded Hardware Canvas Experience */}
        <HardwareHero />

        {/* 2. Industry & Technical Societies Sponsor Banner */}
        <SponsorsAndPartners />

        {/* 3. Flagship Competition Matrix & Event Catalog */}
        <EventCatalog onSelectEventForRegistration={handleSelectEvent} />

        {/* 4. 48-Hour Operations Timeline & Schedule */}
        <ScheduleMatrix />

        {/* 5. Instant Pass Registration Portal with Digital QR Pass */}
        <RegistrationPortal preselectedEventId={selectedEventId} />

        {/* 6. Department of E&TC Infrastructure & SparkPath Innovation */}
        <DepartmentShowcase />

        {/* 7. FAQs Knowledge Base Accordion */}
        <FaqSection />
      </main>

      {/* 8. Campus Venue Locator, Transit Directions & Team 404 Credits */}
      <FooterAndVenue />
    </div>
  );
}

export default App;
