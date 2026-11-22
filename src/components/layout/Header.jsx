import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { LANGUAGES, useLanguage } from '../../i18n/useLanguage';
import { useTheme } from '../../theme/useTheme';

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

function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  const index = LANGUAGES.findIndex((option) => option.code === lang);
  const current = LANGUAGES[index];
  const next = LANGUAGES[(index + 1) % LANGUAGES.length];
  const label = `${t.header.language}: ${current.name} → ${next.name}`;

  return (
    <button
      type="button"
      className={styles.langButton}
      onClick={() => setLang(next.code)}
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.langIcon}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
      <span key={current.code} lang={current.htmlLang} className={styles.langCode}>
        {current.label}
      </span>
    </button>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.headerContainer} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navWrapper}>
        <a href="#top" className={styles.logo}>
          <span className={styles.logoPrefix}>&lt;</span>
          Lucas Ferraz
          <span className={styles.logoSuffix}> /&gt;</span>
        </a>

        <div className={styles.actions}>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
