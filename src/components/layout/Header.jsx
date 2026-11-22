import { useEffect, useId, useRef, useState } from 'react';
import styles from './Header.module.css';
import { LANGUAGES, useLanguage } from '../../i18n/useLanguage';
import { useTheme } from '../../theme/useTheme';
import { FullscreenToggle, HelpButton, TvModeToggle } from './HeaderTools';

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
    <button
      type="button"
      className={styles.themeButton}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      data-tour="theme"
    >
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

/*
 * Mapa-múndi simplificado em projeção equirretangular: 36 unidades de largura
 * (10° de longitude cada) por 18 de altura (10° de latitude), com o equador em
 * y = 12. O planeta tem 18 de diâmetro, então mostra metade do mundo por vez.
 */
const WORLD = (
  <>
    <path d="M1.5 5.5C1.67 5.30 2.92 5.12 4 5C5.08 4.88 7.00 4.72 8 4.8C9.00 4.88 9.33 5.22 10 5.5C10.67 5.78 11.92 6.08 12 6.5C12.08 6.92 10.83 7.50 10.5 8C10.17 8.50 10.37 9.13 10 9.5C9.63 9.87 8.72 10.15 8.3 10.2C7.88 10.25 7.85 10.05 7.5 9.8C7.15 9.55 6.53 9.13 6.2 8.7C5.87 8.27 6.03 7.62 5.5 7.2C4.97 6.78 3.67 6.48 3 6.2C2.33 5.92 1.33 5.70 1.5 5.5Z" />
    <path d="M13 4C13.45 3.90 15.33 4.10 15.5 4.4C15.67 4.70 14.45 5.70 14 5.8C13.55 5.90 12.97 5.30 12.8 5C12.63 4.70 12.55 4.10 13 4Z" />
    <path d="M10 11C10.33 10.75 11.25 10.72 12 11C12.75 11.28 14.17 12.17 14.5 12.7C14.83 13.23 14.50 13.40 14 14.2C13.50 15.00 12.03 17.12 11.5 17.5C10.97 17.88 11.05 17.33 10.8 16.5C10.55 15.67 10.13 13.42 10 12.5C9.87 11.58 9.67 11.25 10 11Z" />
    <path d="M17 8.4C16.42 8.08 16.67 6.90 17 6.5C17.33 6.10 18.33 6.25 19 6C19.67 5.75 20.50 4.75 21 5C21.50 5.25 22.08 6.93 22 7.5C21.92 8.07 21.33 8.25 20.5 8.4C19.67 8.55 17.58 8.72 17 8.4Z" />
    <path d="M16.3 10.5C16.30 10.03 16.22 8.98 17 8.7C17.78 8.42 20.00 8.45 21 8.8C22.00 9.15 22.83 10.02 23 10.8C23.17 11.58 22.50 12.72 22 13.5C21.50 14.28 20.50 15.67 20 15.5C19.50 15.33 19.50 13.17 19 12.5C18.50 11.83 17.45 11.83 17 11.5C16.55 11.17 16.30 10.97 16.3 10.5Z" />
    <path d="M22 7.5C21.92 6.97 21.00 5.55 22 5C23.00 4.45 25.67 4.17 28 4.2C30.33 4.23 35.33 4.57 36 5.2C36.67 5.83 33.00 7.23 32 8C31.00 8.77 30.58 9.30 30 9.8C29.42 10.30 29.17 10.77 28.5 11C27.83 11.23 26.58 11.40 26 11.2C25.42 11.00 25.42 10.08 25 9.8C24.58 9.52 23.92 9.77 23.5 9.5C23.08 9.23 22.75 8.53 22.5 8.2C22.25 7.87 22.08 8.03 22 7.5Z" />
    <path d="M29.5 14C29.83 13.63 30.87 13.08 31.5 13.2C32.13 13.32 33.13 14.27 33.3 14.7C33.47 15.13 33.13 15.68 32.5 15.8C31.87 15.92 30.00 15.70 29.5 15.4C29.00 15.10 29.17 14.37 29.5 14Z" />
    <path d="M0 19.8 L6 19.4 L12 19.9 L18 19.3 L24 19.8 L30 19.4 L36 19.8 L36 22 L0 22Z" />
  </>
);

/*
 * País em destaque para cada idioma: x é a longitude do país no mapa e marker
 * é onde ele fica na tela depois que o planeta gira até deixá-lo no centro
 * (já considerando a inclinação de 15° do eixo).
 */
const COUNTRIES = {
  en: {
    x: 8.2,
    marker: [10.99, 8.23],
    shape: 'M5.6 7.2C6.08 7.05 7.82 7.07 8.5 7.1C9.18 7.13 9.28 7.33 9.7 7.4C10.12 7.47 10.88 7.37 11 7.5C11.12 7.63 10.58 7.97 10.4 8.2C10.22 8.43 9.97 8.68 9.9 8.9C9.83 9.12 10.15 9.47 10 9.5C9.85 9.53 9.28 9.12 9 9.1C8.72 9.08 8.57 9.43 8.3 9.4C8.03 9.37 7.73 9.00 7.4 8.9C7.07 8.80 6.60 8.95 6.3 8.8C6.00 8.65 5.72 8.27 5.6 8C5.48 7.73 5.12 7.35 5.6 7.2Z',
  },
  pt: {
    x: 12.8,
    marker: [12.26, 12.97],
    shape: 'M10.7 12.8C10.78 12.55 11.62 11.67 12 11.5C12.38 11.33 12.58 11.63 13 11.8C13.42 11.97 14.32 12.22 14.5 12.5C14.68 12.78 14.32 13.12 14.1 13.5C13.88 13.88 13.43 14.50 13.2 14.8C12.97 15.10 12.87 15.27 12.7 15.3C12.53 15.33 12.28 15.22 12.2 15C12.12 14.78 12.32 14.33 12.2 14C12.08 13.67 11.75 13.20 11.5 13C11.25 12.80 10.62 13.05 10.7 12.8Z',
  },
  es: {
    x: 17.6,
    marker: [10.96, 8.14],
    shape: 'M17.1 7.7C17.18 7.64 17.60 7.63 17.8 7.65C18.00 7.67 18.27 7.72 18.3 7.8C18.33 7.88 18.08 8.01 18 8.1C17.92 8.19 17.90 8.28 17.8 8.33C17.70 8.38 17.52 8.41 17.4 8.4C17.28 8.39 17.12 8.37 17.1 8.3C17.08 8.23 17.30 8.10 17.3 8C17.30 7.90 17.02 7.76 17.1 7.7Z',
  },
};

const MAP_WIDTH = 36;
const SPIN_MS = 1400;
const MIN_SPIN = 12;

const offsetFor = (lang) => 12 - COUNTRIES[lang].x;

/*
 * Planetinha: oceano, continentes, brilho e sombra de esfera, com o eixo
 * inclinado. Ao trocar de idioma ele gira sempre para o leste até o país da
 * língua ficar no centro, pinta o país e solta um pulso em cima dele.
 * O mapa é desenhado várias vezes lado a lado (para aguentar cliques seguidos); depois de cada giro o deslocamento
 * volta para a primeira volta sem animação, o que não aparece porque o mapa se repete.
 */
function Planet({ lang }) {
  const id = useId();
  const [offset, setOffset] = useState(() => offsetFor(lang));
  const [spinning, setSpinning] = useState(false);
  const offsetRef = useRef(offset);
  const shownLang = useRef(lang);

  useEffect(() => {
    if (shownLang.current === lang) return undefined;
    shownLang.current = lang;

    const base = offsetFor(lang);
    let target = base;
    while (target < offsetRef.current + MIN_SPIN) target += MAP_WIDTH;

    offsetRef.current = target;
    setSpinning(true);
    setOffset(target);

    const timer = setTimeout(() => {
      offsetRef.current = base;
      setSpinning(false);
      setOffset(base);
    }, SPIN_MS);
    return () => clearTimeout(timer);
  }, [lang]);

  const country = COUNTRIES[lang];
  const world = (
    <>
      {WORLD}
      {Object.entries(COUNTRIES).map(([code, { shape }]) => (
        <path key={code} d={shape} className={code === lang ? styles.countryActive : styles.country} />
      ))}
    </>
  );

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.planet}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <circle cx="12" cy="12" r="9" />
        </clipPath>
        <radialGradient id={`${id}-light`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
          <stop offset="80%" stopColor="#000" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
      </defs>

      <g clipPath={`url(#${id}-clip)`}>
        <circle className={styles.ocean} cx="12" cy="12" r="9" />
        <g transform="rotate(-15 12 12)">
          <g
            className={`${styles.land} ${spinning ? styles.spinning : ''}`}
            style={{ transform: `translateX(${offset}px)`, '--spin': `${SPIN_MS}ms` }}
          >
            {[-5, -4, -3, -2, -1, 0, 1].map((copy) => (
              <g key={copy} transform={`translate(${copy * MAP_WIDTH} 0)`}>{world}</g>
            ))}
          </g>
        </g>
        <circle cx="12" cy="12" r="9" fill={`url(#${id}-light)`} />
      </g>
      <circle className={styles.planetEdge} cx="12" cy="12" r="9" />

      {!spinning && (
        <g key={lang} className={styles.marker}>
          <circle className={styles.markerPulse} cx={country.marker[0]} cy={country.marker[1]} r="1.2" />
          <circle className={styles.markerDot} cx={country.marker[0]} cy={country.marker[1]} r="1" />
        </g>
      )}
    </svg>
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
      data-tour="lang"
      onClick={() => setLang(next.code)}
      aria-label={label}
      title={label}
    >
      <span className={styles.langIcon}>
        <Planet lang={current.code} />
      </span>
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
        <a href="#top" className={styles.logo} data-tour="logo">
          <span className={styles.logoPrefix}>&lt;</span>
          Lucas Ferraz
          <span className={styles.logoSuffix}> /&gt;</span>
        </a>

        <div className={styles.actions}>
          <HelpButton />
          <TvModeToggle />
          <FullscreenToggle />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
