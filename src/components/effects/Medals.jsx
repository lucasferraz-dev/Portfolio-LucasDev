import { useId } from 'react';
import styles from './Medals.module.css';

/*
 * Pódio das tecnologias de um projeto: ouro para a mais usada, prata para a
 * segunda e bronze para a terceira. Cada medalha tem a fita em V nas cores do
 * lugar, o disco de metal com brilho e o logo gravado em relevo no centro.
 *
 * mode="card": ficam escondidas e descem penduradas pela fita, uma de cada vez,
 * quando show é verdadeiro (mouse em cima do card).
 * mode="modal": caem no canto do modal quando ele abre e ficam balançando.
 */
const RANKS = [
  { key: 'gold', label: '1º', metal: ['#fff3b0', '#f2c94c', '#b7861f'], ribbon: ['#d64545', '#8f2424'] },
  { key: 'silver', label: '2º', metal: ['#ffffff', '#c9ced6', '#7f8792'], ribbon: ['#3d7fd6', '#22508f'] },
  { key: 'bronze', label: '3º', metal: ['#ffd2a8', '#c98447', '#7a4a20'], ribbon: ['#2f9e63', '#1c6340'] },
];

function Medal({ rank, name, icon, index, label }) {
  const id = useId().replace(/:/g, '');
  const { metal, ribbon } = RANKS[rank];

  return (
    <span className={styles.medal} style={{ '--i': index }} title={`${label(RANKS[rank].label)} ${name}`}>
      <svg viewBox="0 0 40 64" aria-hidden="true">
        <defs>
          <radialGradient id={`${id}-metal`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={metal[0]} />
            <stop offset="45%" stopColor={metal[1]} />
            <stop offset="100%" stopColor={metal[2]} />
          </radialGradient>
          <linearGradient id={`${id}-ribbon`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ribbon[1]} />
            <stop offset="50%" stopColor={ribbon[0]} />
            <stop offset="100%" stopColor={ribbon[1]} />
          </linearGradient>
        </defs>

        {/* fita em V */}
        <path d="M8 0h9l7 26h-9z" fill={`url(#${id}-ribbon)`} />
        <path d="M32 0h-9l-7 26h9z" fill={`url(#${id}-ribbon)`} />
        <path d="M17 0h6v4h-6z" fill="rgb(255 255 255 / 0.25)" />

        {/* argolinha e disco de metal */}
        <rect x="16" y="23" width="8" height="5" rx="1.5" fill={metal[1]} stroke={metal[2]} strokeWidth="0.8" />
        <circle cx="20" cy="44" r="17" fill={`url(#${id}-metal)`} stroke={metal[2]} strokeWidth="1.2" />
        <circle cx="20" cy="44" r="13" fill="none" stroke={metal[2]} strokeOpacity="0.55" strokeWidth="0.8" />
        <circle cx="20" cy="44" r="12.4" fill="none" stroke={metal[0]} strokeOpacity="0.5" strokeWidth="0.5" />

        {/* logo gravado: uma sombra escura e um brilho claro deslocados */}
        <g transform="translate(12.5 36.5) scale(0.625)">
          <path d={icon.path} fill="#ffffff" fillOpacity="0.55" transform="translate(0.6 0.8)" />
          <path d={icon.path} fill={metal[2]} />
        </g>
      </svg>
    </span>
  );
}

export default function Medals({ medals, mode = 'card', show = false, label = (n) => n }) {
  if (!medals?.length) return null;

  return (
    <div className={`${styles.medals} ${styles[mode]} ${show ? styles.show : ''}`}>
      {medals.map(({ name, icon }, i) => (
        <Medal key={name} rank={i} name={name} icon={icon} index={i} label={label} />
      ))}
    </div>
  );
}

/*
 * Conquista do projeto: uma roseta de premiação pendurada por uma fita, com o
 * número grande no centro (ex.: 10º, 8,1%) e uma plaquinha com o detalhe.
 * Fica no canto esquerdo (as medalhas do pódio ficam no direito) e aparece do
 * mesmo jeito: no card quando o mouse está em cima, no modal ao abrir.
 */
export function Achievement({ achievement, mode = 'card', show = false, label }) {
  const id = useId().replace(/:/g, '');
  if (!achievement) return null;
  const petals = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `${(36 + Math.cos(a) * 25).toFixed(2)},${(52 + Math.sin(a) * 25).toFixed(2)}`;
  });

  return (
    <div className={`${styles.achievement} ${styles[mode]} ${show ? styles.show : ''}`}>
      <span className={styles.rosette} title={`${label}: ${achievement.big} · ${achievement.detail}`}>
        <svg viewBox="0 0 72 96" aria-hidden="true">
          <defs>
            <radialGradient id={`${id}-face`} cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#3ef08a" />
              <stop offset="60%" stopColor="#00b34a" />
              <stop offset="100%" stopColor="#007a33" />
            </radialGradient>
          </defs>
          {/* fita que prende na borda do card */}
          <path d="M28 0h16v30H28z" fill="#0b6b31" />
          <path d="M33 0h6v30h-6z" fill="rgb(255 255 255 / 0.18)" />
          {/* rabos da roseta */}
          <path d="M24 66l-8 28 9-6 6 8 6-26z" fill="#0b6b31" />
          <path d="M48 66l8 28-9-6-6 8-6-26z" fill="#0b6b31" />
          {/* pétalas (bordinha franzida) e o miolo */}
          <polygon points={petals.join(' ')} fill="#00c853" stroke="#007a33" strokeWidth="5" strokeLinejoin="round" />
          <circle cx="36" cy="52" r="20" fill={`url(#${id}-face)`} stroke="#e8fff1" strokeOpacity="0.6" strokeWidth="1" />
          <text x="36" y="52" textAnchor="middle" dominantBaseline="central" className={styles.big}>
            {achievement.big}
          </text>
        </svg>
      </span>
      <span className={styles.plaque}>{achievement.detail}</span>
    </div>
  );
}
