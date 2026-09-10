import { useState, useEffect } from 'react';
import styles from './Header.module.css';

const NAV_LINKS = [
  { href: '#about', label: 'Sobre' },
  { href: '#projects', label: 'Projetos' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experiência' },
  { href: '#education', label: 'Formação' },
  { href: '#contact', label: 'Contato' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <header className={`${styles.headerContainer} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navWrapper}>
        <a href="#top" className={styles.logo}>
          <span className={styles.logoPrefix}>&lt;</span>
          Lucas Ferraz
          <span className={styles.logoSuffix}> /&gt;</span>
        </a>

        <nav className={styles.navbar} aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              <span className={styles.linkLine}>//</span> {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          <span className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarTopOpen : ''}`} />
          <span className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarMidOpen : ''}`} />
          <span className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarBottomOpen : ''}`} />
        </button>
      </div>

      {isMenuOpen && (
        <nav id="mobile-menu" className={styles.mobileMenu} aria-label="Navegação mobile">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={styles.linkLine}>//</span> {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}