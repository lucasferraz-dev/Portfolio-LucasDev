import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { LANGUAGES, useLanguage } from '../../i18n/useLanguage';

const NAV_SECTIONS = ['about', 'projects', 'skills', 'experience', 'education', 'contact'];

function LanguageSwitcher({ className }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className={`${styles.langSwitcher} ${className}`} role="group" aria-label={t.header.language}>
      {LANGUAGES.map((option) => (
        <button
          key={option.code}
          type="button"
          lang={option.htmlLang}
          title={option.name}
          aria-label={option.name}
          aria-pressed={lang === option.code}
          className={`${styles.langButton} ${lang === option.code ? styles.langActive : ''}`}
          onClick={() => setLang(option.code)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function Header() {
  const { t } = useLanguage();
  const NAV_LINKS = NAV_SECTIONS.map((id) => ({ href: `#${id}`, label: t.header.nav[id] }));

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

        <nav className={styles.navbar} aria-label={t.header.mainNav}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              <span className={styles.linkLine}>//</span> {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <LanguageSwitcher className={styles.langSwitcherHeader} />

          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? t.header.closeMenu : t.header.openMenu}
          >
            <span className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarTopOpen : ''}`} />
            <span className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarMidOpen : ''}`} />
            <span className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarBottomOpen : ''}`} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="mobile-menu" className={styles.mobileMenu} aria-label={t.header.mobileNav}>
          <LanguageSwitcher className={styles.langSwitcherMobile} />

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