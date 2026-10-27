import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { LANGUAGES, useLanguage } from '../../i18n/useLanguage';
import { useTheme } from '../../theme/useTheme';

const NAV_SECTIONS = ['about', 'projects', 'skills', 'journey', 'contact'];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const label = theme === 'dark' ? t.header.lightMode : t.header.darkMode;

  return (
    <button type="button" className={styles.themeButton} onClick={toggleTheme} aria-label={label} title={label}>
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

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
          <ThemeToggle />

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