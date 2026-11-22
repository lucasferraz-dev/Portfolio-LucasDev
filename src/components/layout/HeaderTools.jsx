import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Header.module.css';
import { useLanguage } from '../../i18n/useLanguage';
import Tour from './Tour';

/* ---------- Tela cheia ---------- */

export function FullscreenToggle() {
  const { t } = useLanguage();
  const [isFull, setIsFull] = useState(() => Boolean(document.fullscreenElement));

  useEffect(() => {
    const onChange = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // alguns navegadores (como o Safari do iPhone) não deixam a página ir para tela cheia
  if (!document.fullscreenEnabled) return null;

  const label = isFull ? t.header.exitFullscreen : t.header.fullscreen;
  const toggle = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  return (
    <button
      type="button"
      className={`${styles.themeButton} ${styles.fullscreenButton}`}
      onClick={toggle}
      aria-label={label}
      title={label}
      data-tour="fullscreen"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {isFull ? (
          <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
        ) : (
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
        )}
      </svg>
    </button>
  );
}

/* ---------- Modo TV ---------- */

/* seções que o modo TV passa, em ordem; null é o topo da página */
const TV_SLIDES = [null, 'about', 'projects', 'skills', 'journey', 'contact'];
const SLIDE_MS = 8000;

/*
 * Modo TV: rola sozinho de seção em seção, como slides, e volta ao começo.
 * Para quando a pessoa clica de novo, aperta Esc ou rola a página por conta própria.
 */
export function TvModeToggle() {
  const { t } = useLanguage();
  const [active, setActive] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!active) return undefined;

    const id = TV_SLIDES[slide];
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });

    const timer = setTimeout(() => setSlide((n) => (n + 1) % TV_SLIDES.length), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [active, slide]);

  useEffect(() => {
    if (!active) return undefined;

    const stop = () => setActive(false);
    const onKey = (event) => {
      if (['Escape', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(event.key)) stop();
    };

    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchmove', stop, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);

  const toggle = () => {
    setSlide(0);
    setActive((value) => !value);
  };

  const label = active ? t.header.tvStop : t.header.tvMode;

  return (
    <>
      <button
        type="button"
        className={`${styles.themeButton} ${active ? styles.toolActive : ''}`}
        onClick={toggle}
        aria-label={label}
        aria-pressed={active}
        title={label}
        data-tour="tv"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path d="M8 21h8M12 17v4" />
          {active ? (
            <path className={styles.tvGlyph} d="M10.5 9v4M13.5 9v4" />
          ) : (
            <path className={`${styles.tvGlyph} ${styles.tvPlay}`} d="M10.5 8.8v4.4l3.6-2.2z" />
          )}
        </svg>
      </button>

      {active &&
        createPortal(
          <div className={styles.tvBar} role="status">
            <span className={styles.tvDot} aria-hidden="true" />
            <span className={styles.tvText}>
              {t.header.tvLabel} · {slide + 1}/{TV_SLIDES.length}
            </span>
            <span className={styles.tvProgress} aria-hidden="true">
              <span key={slide} className={styles.tvProgressFill} style={{ '--slide': `${SLIDE_MS}ms` }} />
            </span>
            <button type="button" className={styles.tvStop} onClick={() => setActive(false)} aria-label={t.header.tvStop}>
              ×
            </button>
          </div>,
          document.body
        )}
    </>
  );
}

/* ---------- Como usar ---------- */

/* O “?” dentro de um círculo dá um pulinho e um giro de lado sem parar; o clique abre o tour */
export function HelpButton() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`${styles.themeButton} ${styles.helpButton}`}
        onClick={() => setOpen(true)}
        aria-label={t.header.help}
        title={t.header.help}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.helpMark}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.4 9.3a2.7 2.7 0 0 1 5.2 1c0 1.8-2.6 2.4-2.6 3.9" />
          <path d="M12 17.2h.01" />
        </svg>
      </button>

      {open && <Tour onClose={() => setOpen(false)} />}
    </>
  );
}
