import styles from './Medals.module.css';

/*
 * Pódio das tecnologias de um projeto, num estilo minimalista: círculos de vidro
 * escuro pendurados por um fiozinho (como os chaveiros), com o logo na cor dele,
 * um aro fino na cor do lugar (ouro, prata, bronze) e o número no canto.
 *
 * mode="card": descem quando show é verdadeiro (mouse em cima do card).
 * mode="modal": caem no canto do modal quando ele abre.
 */
const RANKS = [
  { label: '1º', color: '#f2c75c' },
  { label: '2º', color: '#cfd6df' },
  { label: '3º', color: '#d08b55' },
];

// logos muito escuros ficam brancos para aparecer no vidro escuro
function logoColor(hex) {
  const n = parseInt(hex, 16);
  const luminance = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return luminance < 0.28 ? 'var(--color-white)' : `#${hex}`;
}

export default function Medals({ medals, mode = 'card', show = false, label = (n) => n, style }) {
  if (!medals?.length) return null;

  return (
    <div className={`${styles.medals} ${styles[mode]} ${show ? styles.show : ''}`} style={style}>
      {medals.map(({ name, icon }, i) => (
        <span
          key={name}
          className={styles.medal}
          style={{ '--i': i, '--c': RANKS[i].color }}
          title={`${label(RANKS[i].label)} ${name}`}
        >
          <span className={styles.thread} aria-hidden="true" />
          <span className={styles.disc}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={icon.path} fill={logoColor(icon.hex)} fillRule={icon.rule} />
            </svg>
            <span className={styles.rank} aria-hidden="true">
              {i + 1}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}

/*
 * Conquista do projeto: uma pílula de vidro pendurada pelo mesmo fiozinho, com um
 * troféu, o número em destaque (ex.: 10º, 8,1%) e o detalhe. Fica no canto
 * esquerdo (o pódio fica no direito) e aparece do mesmo jeito.
 */
export function Achievement({ achievement, mode = 'card', show = false, label, style }) {
  if (!achievement) return null;

  return (
    <div className={`${styles.achievement} ${styles[mode]} ${show ? styles.show : ''}`} style={style}>
      <span className={styles.tag} title={`${label}: ${achievement.big} · ${achievement.detail}`}>
        <span className={styles.thread} aria-hidden="true" />
        <span className={styles.pill}>
          <svg viewBox="0 0 24 24" className={styles.trophy} aria-hidden="true">
            <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 13v4M9 20h6M10 17h4" />
          </svg>
          <span className={styles.big}>{achievement.big}</span>
          <span className={styles.detail}>{achievement.detail}</span>
        </span>
      </span>
    </div>
  );
}
