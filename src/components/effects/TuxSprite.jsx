import { useId } from 'react';
import styles from './TuxSprite.module.css';

/*
 * Tux desenhado seguindo o mascote clássico do Linux (Larry Ewing): corpo de
 * pera preto com brilho na cabeça, barriga branca-creme que sobe até o bico,
 * olhos ovais com pupila e brilho, bico amarelo-laranja em duas partes, asas
 * caídas e pés laranja largos. Ele está levemente de três-quartos, olhando
 * para a direita, como um sprite: virar para a esquerda é espelhar.
 *
 * mode: 'idle' (pisca e respira), 'walk' (ginga, passos e asas) ou 'sit'
 * (sentado, balançando os pés). O pé fica em y = 120 no viewBox.
 */
export default function TuxSprite({ mode = 'idle', className = '' }) {
  const id = useId().replace(/:/g, '');
  const g = (name) => `url(#${id}-${name})`;

  return (
    <svg viewBox="0 0 100 122" className={`${styles.sprite} ${styles[mode]} ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-body`} cx="38%" cy="22%" r="80%">
          <stop offset="0%" stopColor="#4a4a4f" />
          <stop offset="35%" stopColor="#1c1c20" />
          <stop offset="100%" stopColor="#060607" />
        </radialGradient>
        <radialGradient id={`${id}-belly`} cx="45%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f1efe8" />
          <stop offset="100%" stopColor="#cfccc2" />
        </radialGradient>
        <linearGradient id={`${id}-beakTop`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde26a" />
          <stop offset="100%" stopColor="#f2a516" />
        </linearGradient>
        <linearGradient id={`${id}-beakBottom`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0a020" />
          <stop offset="100%" stopColor="#c8740a" />
        </linearGradient>
        <linearGradient id={`${id}-foot`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbcc3a" />
          <stop offset="60%" stopColor="#f0a020" />
          <stop offset="100%" stopColor="#c46f08" />
        </linearGradient>
        <radialGradient id={`${id}-eye`} cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dedbd2" />
        </radialGradient>
      </defs>

      {/* pés (atrás do corpo) */}
      <g className={styles.footBack}>
        <path
          d="M24 106c-9 0-16 6-14 11 1.5 3.6 13 4 22 3.2 8-.7 14-2 14-6 0-6-11-8.2-22-8.2z"
          fill={g('foot')}
        />
      </g>
      <g className={styles.footFront}>
        <path
          d="M74 106c9 0 18 6 16 11-1.5 3.6-14 4-23 3.2-8-.7-14-2-14-6 0-6 10-8.2 21-8.2z"
          fill={g('foot')}
        />
      </g>

      <g className={styles.body}>
        {/* asa de trás */}
        <g className={styles.flipperBack}>
          <path d="M24 58c-8 9-13 24-10 36 1.4 5 6 4.6 7.6.6 3-9 5.4-19 8.4-28z" fill={g('body')} />
        </g>

        {/* corpo de pera */}
        <path
          d="M52 4C36 4 28 17 28 31c0 9-3 15-7.5 24C14 69 11 86 18 98c7 12 20 16 34 16s27-4 34-16c7-12 4-29-2.5-43C79 46 76 40 76 31 76 17 68 4 52 4z"
          fill={g('body')}
        />

        {/* barriga */}
        <path
          d="M54 38c-12 0-21 13-23 29-2.4 19 5 39 23 40 18-1 25.4-21 23-40-2-16-11-29-23-29z"
          fill={g('belly')}
        />

        {/* olhos */}
        <g className={styles.eyes}>
          <ellipse cx="44" cy="24" rx="6.8" ry="9.2" fill={g('eye')} />
          <ellipse cx="60" cy="24" rx="6.4" ry="9" fill={g('eye')} />
          <circle cx="47" cy="26" r="3.7" fill="#0b0b0c" />
          <circle cx="62.6" cy="26" r="3.5" fill="#0b0b0c" />
          <circle cx="48.2" cy="24.4" r="1.2" fill="#ffffff" />
          <circle cx="63.7" cy="24.4" r="1.1" fill="#ffffff" />
        </g>

        {/* bico em duas partes */}
        <g className={styles.beak}>
          <path d="M43 40c-1-3.4 5-6.6 12-6.6s13.6 3 12.6 6.6c-.8 3-6.6 4.4-12.6 4.4S43.8 43 43 40z" fill={g('beakBottom')} />
          <path d="M41 36.6c2-4.6 8-7.4 14-7.4s12.4 2.8 14 7.4c.9 2.6-6.4 4.8-14 4.8S40 39.2 41 36.6z" fill={g('beakTop')} />
          <path d="M44 38.4c3.6 1.4 7.4 2 11 2s7.6-.6 11-2" fill="none" stroke="#b8650a" strokeWidth="0.9" strokeLinecap="round" />
        </g>

        {/* asa da frente */}
        <g className={styles.flipperFront}>
          <path d="M80 58c8 9 13 24 10 36-1.4 5-6 4.6-7.6.6-3-9-5.4-19-8.4-28z" fill={g('body')} />
        </g>
      </g>
    </svg>
  );
}
