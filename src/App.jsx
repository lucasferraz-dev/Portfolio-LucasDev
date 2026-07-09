import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Contact from './components/sections/Contact';

export default function App() {
  return (
    <main className="min-h-screen bg-[#0b0b10] overflow-x-hidden">
      <Hero />
      <Projects />
      <Skills />
      <Contact />
    </main>
  );
}