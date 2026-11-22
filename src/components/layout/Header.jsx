import { useEffect, useId, useState } from 'react';
import styles from './Header.module.css';
import { LANGUAGES, useLanguage } from '../../i18n/useLanguage';
import { useTheme } from '../../theme/useTheme';

/*
 * Um único desenho que vira sol ou lua: o círculo cresce, uma máscara desliza
 * por cima e recorta a lua crescente, e os raios giram e somem. O ícone mostra
 * o tema para o qual o clique leva (sol no escuro, lua no claro).
 */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const maskId = useId();
  const label = theme === 'dark' ? t.header.lightMode : t.header.darkMode;
  const isMoon = theme === 'light';

  return (
    <button type="button" className={styles.themeButton} onClick={toggleTheme} aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true" className={`${styles.themeIcon} ${isMoon ? styles.moon : ''}`}>
        <mask id={maskId}>
          <rect width="24" height="24" fill="white" stroke="none" />
          <circle className={styles.moonShadow} cx="16.5" cy="7.5" r="7" fill="black" stroke="none" />
        </mask>
        <circle className={styles.sunBody} cx="12" cy="12" r="8" mask={`url(#${maskId})`} />
        <path
          className={styles.sunRays}
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        />
      </svg>
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
      <svg key={current.code} viewBox="0 0 24 24" aria-hidden="true" className={styles.langIcon}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <ellipse className={styles.meridianA} cx="12" cy="12" rx="9" ry="9" />
        <ellipse className={styles.meridianB} cx="12" cy="12" rx="9" ry="9" />
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
