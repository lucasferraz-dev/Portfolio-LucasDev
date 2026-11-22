import styles from './DockerWhale.module.css';

/*
 * Baleia do Docker desenhada do zero, no estilo do logo: casco arredondado com o
 * topo reto, containers empilhados nas costas, olho, boca e uma cauda separada
 * (pedúnculo + nadadeira) para poder bater de verdade. Ela olha para a esquerda.
 *
 * Animação (CSS): a cauda bate presa no fim do corpo e a nadadeira da ponta
 * dobra atrasada, como um chicote; a barbatana rema; os containers balançam um
 * de cada vez; o respiradouro solta esguicho de tempos em tempos.
 */
const CONTAINERS = [
  // [x, y] de cada container (10 x 9), de baixo para cima
  [22, 21], [33, 21], [44, 21], [55, 21], [66, 21],
  [33, 11], [44, 11], [55, 11],
  [44, 1],
];

export default function DockerWhale({ className = '' }) {
  return (
    <svg viewBox="-4 -14 132 92" className={`${styles.whale} ${className}`} aria-hidden="true">
      {/* esguicho */}
      <g className={styles.spout}>
        <path d="M14 24c-1-6-4-10-8-12M14 24c0-7 1-12 3-15M14 24c1-6 5-9 9-10" />
      </g>

      {/* cauda: pedúnculo preso no corpo e a nadadeira, que dobra atrasada */}
      <g className={styles.tail}>
        <path className={styles.body} d="M90 33c6 0 12-1 16-4l3-3 4 4-3 3c-4 5-11 9-20 10z" />
        <g className={styles.fluke}>
          <path className={styles.body} d="M107 27c1-5 3-10 7-12 2-1 4 0 4 2 0 4-3 7-6 9 4-1 9 0 11 2 1 1 0 3-2 3-5 1-10 0-14-1z" />
        </g>
      </g>

      {/* barbatana de baixo, que rema */}
      <g className={styles.flipper}>
        <path className={styles.body} d="M42 56c-2 6-1 12 3 15 2 1 4 0 4-2 0-5-1-10-3-13z" />
      </g>

      {/* casco: topo reto onde ficam os containers e barriga arredondada */}
      <path
        className={styles.body}
        d="M4 38c0-5 4-8 9-8h79c3 0 5 2 4.4 5C94 50 79 64 52 65.6 25 67 4 57 4 38z"
      />
      {/* barriga um pouco mais clara */}
      <path className={styles.belly} d="M10 47c8 9 22 13 40 12.5 18-.5 31-6 38-14-8 13-22 19-40 19.5C30 65.5 16 59 10 47z" />

      {/* olho e boca */}
      <circle className={styles.eye} cx="17" cy="41" r="2.6" />
      <circle className={styles.eyeShine} cx="16.1" cy="40.1" r="0.8" />
      <path className={styles.mouth} d="M7 46c4 3 9 4 14 3" />

      {/* containers nas costas */}
      {CONTAINERS.map(([x, y], i) => (
        <g key={`${x}-${y}`} className={styles.container} style={{ '--i': i }}>
          <rect className={styles.box} x={x} y={y} width="10" height="9" rx="1.4" />
          <path className={styles.ribs} d={`M${x + 3.3} ${y + 2}v5M${x + 6.7} ${y + 2}v5`} />
        </g>
      ))}
    </svg>
  );
}
