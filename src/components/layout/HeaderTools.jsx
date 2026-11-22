import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Header.module.css';
import { useLanguage } from '../../i18n/useLanguage';
import Tour from './Tour';
import { startPresenting } from '../effects/presentation';

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
const SPEED_MIN = 100; // pixels por segundo descendo dentro de uma seção
const MAX_SCROLL_SECONDS = 14; // seções compridas descem mais rápido para não passar disso
const HOLD_START = 2200; // tempo parado no começo de cada seção
const HOLD_END = 1500; // tempo parado no fim, antes de ir para a próxima
const TRAVEL = 900; // tempo da rolagem suave até o começo de uma seção

/* onde cada seção começa e até onde dá para descer nela (fim da seção no pé da tela) */
function slideBounds(index) {
  const absTop = (id) => {
    const el = id && document.getElementById(id);
    return el ? el.getBoundingClientRect().top + window.scrollY : null;
  };
  const start = index === 0 ? 0 : absTop(TV_SLIDES[index]) ?? 0;
  const nextTop = index + 1 < TV_SLIDES.length ? absTop(TV_SLIDES[index + 1]) : null;
  const bottom = nextTop ?? document.documentElement.scrollHeight;
  return { start, end: Math.max(start, bottom - window.innerHeight) };
}

/* qual seção está no topo da tela agora (para continuar de onde a pessoa parou) */
function currentSlide() {
  let found = 0;
  TV_SLIDES.forEach((_, i) => {
    if (slideBounds(i).start <= window.scrollY + 10) found = i;
  });
  return found;
}

/*
 * Modo TV: apresenta o portfólio em tela cheia. Em cada seção ele para um pouco
 * no título, desce devagar até o fim dela e passa para a próxima, voltando ao
 * começo no final. Dá para pausar, voltar e avançar seção e sair quando quiser.
 * Se a pessoa rolar a página por conta própria, ele pausa; ao continuar, segue
 * de onde ela parou.
 */
export function TvModeToggle() {
  const { t } = useLanguage();
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [slide, setSlide] = useState(0);
  const slideRef = useRef(0);
  const phase = useRef({ name: 'hold', until: 0 });
  const progressRef = useRef(null);
  const enteredFullscreen = useRef(false);

  const goTo = useCallback((index) => {
    const next = (index + TV_SLIDES.length) % TV_SLIDES.length;
    slideRef.current = next;
    setSlide(next);
    const { start: top, end } = slideBounds(next);
    window.scrollTo({ top, behavior: 'smooth' });
    phase.current = { name: 'hold', until: performance.now() + TRAVEL + HOLD_START, top, end };
  }, []);

  const stop = useCallback(() => {
    setActive(false);
    if (enteredFullscreen.current && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    enteredFullscreen.current = false;
  }, []);

  const start = () => {
    setPlaying(true);
    setActive(true);
    goTo(0);
    if (document.fullscreenEnabled && !document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => { enteredFullscreen.current = true; })
        .catch(() => {});
    }
  };

  // enquanto o modo TV está ligado, as animações de entrada voltam a rodar a cada seção
  useEffect(() => (active ? startPresenting() : undefined), [active]);

  /*
   * Durante o modo TV: o hover do conteúdo fica desligado (a página descendo sob
   * o cursor parado ficaria disparando os efeitos dos cards) e o cursor some
   * depois de 3 segundos parado, voltando assim que o mouse se mexe.
   */
  useEffect(() => {
    if (!active) return undefined;
    const root = document.documentElement;
    let timer = 0;
    const showCursor = () => {
      root.classList.remove('tv-cursor-hidden');
      clearTimeout(timer);
      timer = setTimeout(() => root.classList.add('tv-cursor-hidden'), 3000);
    };

    root.classList.add('tv-mode');
    showCursor();
    window.addEventListener('mousemove', showCursor);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', showCursor);
      root.classList.remove('tv-mode', 'tv-cursor-hidden');
    };
  }, [active]);

  // o laço que desce a página enquanto está tocando
  useEffect(() => {
    if (!active || !playing) return undefined;

    let frame = 0;
    let last = performance.now();

    /*
     * Começa a descer: mede a seção uma vez só (medir a cada quadro força o
     * navegador a refazer o layout) e guarda a posição com casas decimais por
     * conta própria, já que o navegador arredonda a rolagem e passos menores
     * que 1px se perderiam. Seções compridas ganham uma velocidade maior.
     */
    const startScroll = () => {
      const { start: top, end } = slideBounds(slideRef.current);
      const speed = Math.max(SPEED_MIN, (end - top) / MAX_SCROLL_SECONDS);
      phase.current = { name: 'scroll', pos: window.scrollY, top, end, speed };
    };

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 100);
      last = now;
      const current = phase.current;

      if (current.name === 'resume' || (current.name === 'hold' && now >= current.until)) {
        startScroll();
      } else if (current.name === 'scroll') {
        current.pos += (current.speed * dt) / 1000;
        if (current.pos >= current.end) {
          window.scrollTo({ top: current.end, behavior: 'instant' });
          phase.current = { ...current, name: 'end', until: now + HOLD_END };
        } else {
          window.scrollTo({ top: current.pos, behavior: 'instant' });
        }
      } else if (current.name === 'end' && now >= current.until) {
        goTo(slideRef.current + 1);
      }

      const { top, end } = phase.current;
      if (progressRef.current && top !== undefined) {
        const p = end > top ? (window.scrollY - top) / (end - top) : 1;
        progressRef.current.style.transform = `scaleX(${Math.min(Math.max(p, 0), 1)})`;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, playing, goTo]);

  // teclado, rolagem manual e saída da tela cheia
  useEffect(() => {
    if (!active) return undefined;

    const pause = () => setPlaying(false);
    const onKey = (event) => {
      if (event.key === 'Escape') stop();
      else if (event.key === ' ') {
        event.preventDefault();
        setPlaying((value) => !value);
      } else if (event.key === 'ArrowRight') goTo(slideRef.current + 1);
      else if (event.key === 'ArrowLeft') goTo(slideRef.current - 1);
      else if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) pause();
    };
    const onFullscreen = () => {
      if (enteredFullscreen.current && !document.fullscreenElement) {
        enteredFullscreen.current = false;
        setActive(false);
      }
    };

    window.addEventListener('wheel', pause, { passive: true });
    window.addEventListener('touchmove', pause, { passive: true });
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => {
      window.removeEventListener('wheel', pause);
      window.removeEventListener('touchmove', pause);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFullscreen);
    };
  }, [active, goTo, stop]);

  // ao continuar depois de uma pausa, segue a partir de onde a página está
  const togglePlay = () => {
    if (!playing) {
      const index = currentSlide();
      slideRef.current = index;
      setSlide(index);
      phase.current = { name: 'resume' };
    }
    setPlaying((value) => !value);
  };

  const label = active ? t.header.tvStop : t.header.tvMode;

  return (
    <>
      <button
        type="button"
        className={`${styles.themeButton} ${active ? styles.toolActive : ''}`}
        onClick={active ? stop : start}
        aria-label={label}
        aria-pressed={active}
        title={label}
        data-tour="tv"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path d="M8 21h8M12 17v4" />
          <path className={`${styles.tvGlyph} ${styles.tvPlay}`} d="M10.5 8.8v4.4l3.6-2.2z" />
        </svg>
      </button>

      {active &&
        createPortal(
          <div className={styles.tvBar} role="toolbar" aria-label={t.header.tvLabel}>
            <span className={`${styles.tvDot} ${playing ? '' : styles.tvDotPaused}`} aria-hidden="true" />
            <span className={styles.tvText} aria-live="polite">
              {t.header.tvSections[slide]} · {slide + 1}/{TV_SLIDES.length}
            </span>

            <span className={styles.tvProgress} aria-hidden="true">
              <span ref={progressRef} className={styles.tvProgressFill} />
            </span>

            <div className={styles.tvControls}>
              <button type="button" className={styles.tvControl} onClick={() => goTo(slideRef.current - 1)} aria-label={t.header.tvPrev} title={t.header.tvPrev}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14M19 5L9 12l10 7z" /></svg>
              </button>
              <button type="button" className={styles.tvControl} onClick={togglePlay} aria-label={playing ? t.header.tvPause : t.header.tvPlay} title={playing ? t.header.tvPause : t.header.tvPlay}>
                {playing ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path className={styles.tvFilled} d="M7 5l12 7-12 7z" /></svg>
                )}
              </button>
              <button type="button" className={styles.tvControl} onClick={() => goTo(slideRef.current + 1)} aria-label={t.header.tvNext} title={t.header.tvNext}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5v14M5 5l10 7-10 7z" /></svg>
              </button>
              <button type="button" className={styles.tvControl} onClick={stop} aria-label={t.header.tvStop} title={t.header.tvStop}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
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
