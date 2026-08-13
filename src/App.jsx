import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#06060a] text-slate-300 selection:bg-[#00cc55]/20 selection:text-[#00cc55]">
      <Header />

      <main className="pt-20">
        <Hero />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Analytics />
    </div>
  );
}
