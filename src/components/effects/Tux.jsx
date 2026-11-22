import { useEffect, useRef, useState } from 'react';
import styles from './Tux.module.css';
import { useLanguage } from '../../i18n/useLanguage';

/*
 * Pinguim no estilo do Tux, sentado na borda de cima do terminal do contato.
 * Parado, ele balança os pés, pisca e de vez em quando acena. Ao clicar, dá um
 * pulinho e solta um balão com uma frase aleatória (sem repetir a anterior).
 */
export default function Tux({ className = '' }) {
  const { t } = useLanguage();
  const lines = t.fun.tuxLines;
  const [line, setLine] = useState(null);
  const [hops, setHops] = useState(0);
  const lastIndex = useRef(-1);

  useEffect(() => {
    if (line === null) return undefined;
    const timer = setTimeout(() => setLine(null), 3200);
    return () => clearTimeout(timer);
  }, [line, hops]);

  const poke = () => {
    let index = Math.floor(Math.random() * lines.length);
    if (index === lastIndex.current) index = (index + 1) % lines.length;
    lastIndex.current = index;
    setLine(lines[index]);
    setHops((n) => n + 1);
  };

  return (
    <div className={`${styles.wrapper} ${className}`} data-tour="tux">
      {line !== null && (
        <span key={hops} className={styles.bubble} role="status">
          {line}
        </span>
      )}

      <button type="button" className={styles.button} onClick={poke} aria-label={t.fun.tuxLabel} title={t.fun.tuxLabel}>
        <svg key={hops} viewBox="0 0 64 72" className={`${styles.tux} ${hops ? styles.hop : ''}`} aria-hidden="true">
          {/* pés pendurados na borda */}
          <g className={styles.footLeft}>
            <path className={styles.orange} d="M20 58c-4 0-8 3-8 7 0 2 2 3 5 3h9c2 0 3-2 2-4l-2-4c-1-1-3-2-6-2z" />
          </g>
          <g className={styles.footRight}>
            <path className={styles.orange} d="M44 58c4 0 8 3 8 7 0 2-2 3-5 3h-9c-2 0-3-2-2-4l2-4c1-1 3-2 6-2z" />
          </g>

          {/* corpo */}
          <path className={styles.black} d="M32 4C21 4 15 13 15 24c0 6-4 10-5 17-1 9 4 19 22 19s23-10 22-19c-1-7-5-11-5-17C49 13 43 4 32 4z" />
          <path className={styles.white} d="M32 24c-8 0-12 8-12 16 0 9 5 16 12 16s12-7 12-16c0-8-4-16-12-16z" />

          {/* asa que acena */}
          <g className={styles.wing}>
            <path className={styles.black} d="M48 30c4 3 8 10 7 17-1 3-4 2-5 0-2-5-4-9-6-12z" />
          </g>
          <path className={styles.black} d="M16 30c-4 3-8 10-7 17 1 3 4 2 5 0 2-5 4-9 6-12z" />

          {/* rosto */}
          <ellipse className={styles.white} cx="26.5" cy="17" rx="4.5" ry="5.5" />
          <ellipse className={styles.white} cx="37.5" cy="17" rx="4.5" ry="5.5" />
          <g className={styles.eyes}>
            <circle className={styles.black} cx="27.5" cy="18" r="2.2" />
            <circle className={styles.black} cx="36.5" cy="18" r="2.2" />
          </g>
          <path className={styles.orange} d="M25 24c2-2 4-3 7-3s5 1 7 3c-2 3-4 4-7 4s-5-1-7-4z" />
        </svg>
      </button>
    </div>
  );
}
