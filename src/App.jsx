import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Timeline from './components/sections/Timeline';
import ScrollHint from './components/layout/ScrollHint';
import Contact from './components/sections/Contact';
import AsciiWaves from './components/effects/AsciiWaves';
import FactStrips from './components/effects/FactStrips';
import { Analytics } from '@vercel/analytics/react';
import { useLanguage } from './i18n/useLanguage';

export default function App() {
  const { t } = useLanguage();

  return (
    <div
      id="top"
      className="min-h-screen bg-page text-slate-300 selection:bg-accent/20 selection:text-accent"
    >
      <a href="#main" className="skip-link">{t.app.skipLink}</a>

      <AsciiWaves className="fixed inset-0 w-full h-full z-0 pointer-events-none" />

      <Header />
      <ScrollHint />

      {/* Ordem pensada para quem avalia: quem sou → o que fiz → como faço */}
      <main id="main" className="relative z-10 pt-20">
        <FactStrips />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Timeline />
        <Contact />
      </main>


      <Analytics />
    </div>
  );
}