import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Education from './components/sections/Education';
import Contact from './components/sections/Contact';
import { Analytics } from '@vercel/analytics/react';
import { useLanguage } from './i18n/useLanguage';

export default function App() {
  const { t } = useLanguage();

  return (
    <div
      id="top"
      className="min-h-screen bg-[#06060a] text-slate-300 selection:bg-[#00cc55]/20 selection:text-[#00cc55]"
    >
      <a href="#main" className="skip-link">{t.app.skipLink}</a>

      <Header />

      {/* Ordem pensada para quem avalia: quem sou → o que fiz → como faço */}
      <main id="main" className="pt-20">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Education />
        <Contact />
      </main>

      <footer className="px-6 md:px-16 lg:px-24 py-10 border-t border-slate-900/60 flex flex-col md:flex-row gap-3 items-center justify-between">
        <span className="font-mono text-xs tracking-widest uppercase text-slate-600">
          © {new Date().getFullYear()} Lucas Ferraz dos Santos
        </span>
        <span className="font-mono text-xs tracking-widest uppercase text-slate-700">
          Built with React & curiosity.
        </span>
      </footer>

      <Analytics />
    </div>
  );
}