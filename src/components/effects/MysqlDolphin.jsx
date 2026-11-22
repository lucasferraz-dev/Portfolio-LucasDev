import { useId } from 'react';
import styles from './MysqlDolphin.module.css';

/*
 * Golfinho do MySQL desenhado de lado, do zero: corpo comprido com bico,
 * barbatana dorsal, nadadeira peitoral e a cauda separada (pedúnculo e
 * nadadeiras) para poder bater. Azul do MySQL no dorso e barriga clara.
 * Ele olha para a esquerda. kicking: bate a cauda rápido (saindo da água).
 */
export default function MysqlDolphin({ kicking = false, className = '' }) {
  const id = useId().replace(/:/g, '');

  return (
    <svg viewBox="-2 0 128 60" className={`${styles.dolphin} ${kicking ? styles.kicking : ''} ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f78b0" />
          <stop offset="45%" stopColor="#6aa2d6" />
          <stop offset="70%" stopColor="#dcebf8" />
          <stop offset="100%" stopColor="#f4f9fd" />
        </linearGradient>
      </defs>

      {/* cauda: pedúnculo e nadadeiras, presa no fim do corpo */}
      <g className={styles.tail}>
        <path
          fill={`url(#${id}-skin)`}
          d="M90 24.5c9 1 15 3 21 5.5-6 2.5-12 4.5-21 5.5z M108 30c3-6 8-11 14-12-2 5-4 9-7 12 3 3 5 7 7 12-6-1-11-6-14-12z"
        />
      </g>

      {/* nadadeira peitoral */}
      <g className={styles.flipper}>
        <path fill="#4f88c0" d="M38 39c2 7 6 12 12 15-1-6-2-10-1-14z" />
      </g>

      {/* barbatana dorsal */}
      <path fill="#3f78b0" d="M56 19c2-8 8-14 15-15-2 6-2 11 0 16z" />

      {/* corpo com o bico na frente */}
      <path
        fill={`url(#${id}-skin)`}
        d="M14 26C20 22 28 20 36 19c20-3 40-2 56 4 4 1.5 7 2.5 8 3.5-3 3.5-9 6.5-17 9-18 5.5-41 6.5-58 2-6-1.5-10-3.5-13-5-4 .5-8 .5-10.5-.5-1.5-.6-1.2-1.8.3-2.2 3.2-.8 7.2-1.8 12.2-3.8z"
      />

      {/* olho, brilho e boca */}
      <circle cx="19" cy="27.4" r="1.7" fill="#0b1a2a" />
      <circle cx="18.5" cy="26.9" r="0.5" fill="#ffffff" />
      <path d="M3 31c5 .9 10 1 15.5.3" fill="none" stroke="#2c5a86" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}
