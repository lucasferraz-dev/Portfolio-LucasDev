import { useId } from 'react';
import styles from './SkillArt.module.css';

/*
 * Cada tecnologia tem uma animação própria.
 * As animações só rodam quando o grupo entra na tela (classe global .is-revealed)
 * e usam a variável --t0 do card para entrar em cascata.
 */

const cx = (...names) => names.filter(Boolean).join(' ');

const useSafeId = () => useId().replace(/[^a-zA-Z0-9_-]/g, '');

const isDarkColor = (hex) => {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 70;
};

const brandColor = (icon) => (isDarkColor(icon.hex) ? 'var(--color-white)' : `#${icon.hex}`);

function Art({ className, children, viewBox = '0 0 24 24', style }) {
  return (
    <svg viewBox={viewBox} className={cx(styles.art, className)} style={style} aria-hidden="true" overflow="visible">
      {children}
    </svg>
  );
}

/* Recorta uma parte retangular do ícone para ela poder se mexer sozinha. */
function ClipRect({ id, rect }) {
  const [x, y, w, h] = rect;
  return (
    <clipPath id={id}>
      <rect x={x} y={y} width={w} height={h} />
    </clipPath>
  );
}

/* Tudo menos as partes que se mexem (evenodd tira os retângulos do quadrado inteiro). */
function ClipRest({ id, rects }) {
  const holes = rects.map(([x, y, w, h]) => `M${x} ${y}h${w}v${h}h${-w}Z`).join('');
  return (
    <clipPath id={id}>
      <path clipRule="evenodd" d={`M-6 -6H30V30H-6Z${holes}`} />
    </clipPath>
  );
}

/* ---------- Traço: contorno desenhado na hora e depois preenchido ---------- */

function DrawArt({ icon, extra, className }) {
  return (
    <Art className={className} style={{ color: brandColor(icon) }}>
      <path d={icon.path} pathLength="1" className={styles.drawStroke} />
      <path d={icon.path} className={styles.drawFill} />
      {extra}
    </Art>
  );
}

/* ---------- Monogramas (tecnologias sem ícone oficial) ---------- */

function Mono({ text, size = 7, className, children, before, textClass }) {
  const id = useSafeId();
  return (
    <Art className={cx(styles.mono, className)}>
      {before}
      <rect x="1.5" y="6" width="21" height="12" rx="3" className={styles.monoBox} />
      <clipPath id={`${id}-type`}>
        <rect x="1.5" y="6" width="21" height="12" className={styles.monoTyper} />
      </clipPath>
      <text
        x="12"
        y="12.4"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size}
        className={cx(styles.monoText, textClass)}
        clipPath={`url(#${id}-type)`}
      >
        {text}
      </text>
      {children}
    </Art>
  );
}

/* ================= Linguagens ================= */

const PY_BLUE =
  'M14.25 0.18L15.15 0.38 15.88 0.64 16.47 0.94 16.92 1.26 17.26 1.6 17.51 1.94 17.67 2.27 17.77 2.57 17.81 2.83 17.83 3.03 17.82 3.16V8.5L17.77 9.13 17.64 9.68 17.43 10.14 17.17 10.52 16.87 10.83 16.54 11.08 16.19 11.27 15.84 11.41 15.51 11.51 15.21 11.58 14.95 11.62 14.74 11.64H8.77L8.08 11.69 7.49 11.83 6.99 12.05 6.58 12.32 6.25 12.64 5.98 12.99 5.78 13.35 5.63 13.72 5.53 14.07 5.46 14.39 5.42 14.66 5.4 14.87V17.93H3.17L2.96 17.9 2.68 17.83 2.36 17.71 2.01 17.53 1.65 17.27 1.29 16.91 0.94 16.45 0.62 15.86 0.34 15.13 0.13 14.25-0.01 13.2-0.06 11.97 0 10.75 0.16 9.71 0.4 8.84 0.72 8.13 1.08 7.56 1.48 7.12 1.9 6.79 2.32 6.55 2.72 6.39 3.08 6.29 3.4 6.24 3.64 6.23H3.8L3.86 6.24H12.02V5.41H6.18L6.17 2.66 6.15 2.29 6.2 1.95 6.31 1.64 6.48 1.36 6.73 1.1 7.04 0.87 7.42 0.67 7.86 0.49 8.37 0.34 8.95 0.22 9.59 0.12 10.3 0.06 11.07 0.02 11.91 0 13.18 0.05ZM7.95 2.16L7.72 2.49 7.64 2.9 7.72 3.31 7.95 3.65 8.28 3.87 8.69 3.96 9.1 3.87 9.43 3.65 9.66 3.31 9.74 2.9 9.66 2.49 9.43 2.16 9.1 1.94 8.69 1.85 8.28 1.94Z';
const PY_YELLOW =
  'M21.04 6.11L21.32 6.17 21.64 6.29 21.99 6.47 22.35 6.74 22.71 7.09 23.06 7.56 23.38 8.15 23.66 8.88 23.87 9.76 24.01 10.8 24.06 12.03 24 13.26 23.84 14.3 23.6 15.16 23.28 15.87 22.92 16.44 22.52 16.89 22.1 17.22 21.68 17.46 21.28 17.62 20.92 17.71 20.6 17.76 20.36 17.78 20.2 17.77H11.98V18.59H17.82L17.83 21.35 17.85 21.71 17.8 22.05 17.69 22.36 17.52 22.65 17.27 22.9 16.96 23.14 16.58 23.34 16.14 23.51 15.63 23.66 15.05 23.79 14.41 23.88 13.7 23.95 12.93 23.99 12.09 24 10.82 23.96 9.75 23.82 8.85 23.62 8.12 23.37 7.53 23.07 7.08 22.74 6.74 22.4 6.49 22.06 6.33 21.73 6.23 21.43 6.19 21.18 6.17 20.98 6.18 20.85V15.51L6.23 14.87 6.36 14.33 6.57 13.87 6.83 13.49 7.13 13.17 7.46 12.93 7.81 12.73 8.16 12.59 8.49 12.49 8.79 12.43 9.05 12.39 9.26 12.37 9.39 12.36H15.23L15.92 12.31 16.51 12.17 17.01 11.96 17.42 11.68 17.75 11.36 18.02 11.01 18.22 10.65 18.37 10.29 18.47 9.94 18.54 9.62 18.58 9.34 18.6 9.13V6.07H20.69L20.83 6.08ZM14.57 20.36L14.34 20.69 14.26 21.1 14.34 21.51 14.57 21.84 14.9 22.07 15.31 22.15 15.72 22.07 16.05 21.84 16.28 21.51 16.36 21.1 16.28 20.69 16.05 20.36 15.72 20.13 15.31 20.05 14.9 20.13Z';

/* Python: as duas cobras chegam de cantos opostos, se enroscam e mostram a língua */
function PythonArt() {
  return (
    <Art>
      <g className={styles.pyBlueIn}>
        <g className={styles.pyBlueSway}>
          <path className={styles.pyTongueA} d="M6.2 3.2H4.6M4.6 3.2l-.7-.6M4.6 3.2l-.7.6" />
          <path d={PY_BLUE} fill="#4B8BBE" fillRule="evenodd" />
        </g>
      </g>
      <g className={styles.pyYellowIn}>
        <g className={styles.pyYellowSway}>
          <path className={styles.pyTongueB} d="M17.8 20.8h1.6M19.4 20.8l.7-.6M19.4 20.8l.7.6" />
          <path d={PY_YELLOW} fill="#FFD43B" fillRule="evenodd" />
        </g>
      </g>
    </Art>
  );
}

/* JavaScript: o quadrado enche de baixo pra cima como um copo, com a superfície ondulando */
function JavaScriptArt({ icon }) {
  const id = useSafeId();
  const wave = 'M-24 0q3-1.6 6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0V40H-24Z';
  return (
    <Art>
      <mask id={id} maskUnits="userSpaceOnUse" x="-6" y="-6" width="36" height="36">
        <g className={styles.jsRise}>
          <path d={wave} fill="#fff" className={styles.jsWave} />
        </g>
      </mask>
      <path d={icon.path} fill="none" stroke={`#${icon.hex}`} strokeWidth="0.35" className={styles.jsGlass} />
      <path d={icon.path} fill={`#${icon.hex}`} mask={`url(#${id})`} />
    </Art>
  );
}

/* Java: o Duke dá dois pulinhos, acena, o nariz vermelho brilha e ele pia */
function JavaArt({ icon }) {
  const id = useSafeId();
  const armL = [0, 10.5, 4.4, 9.5];
  const armR = [19.6, 10.5, 4.4, 9.5];
  return (
    <Art className={styles.white}>
      <defs>
        <ClipRest id={`${id}-rest`} rects={[armL, armR]} />
        <ClipRect id={`${id}-l`} rect={armL} />
        <ClipRect id={`${id}-r`} rect={armR} />
      </defs>
      <g className={styles.dukeHop}>
        <path d={icon.path} clipPath={`url(#${id}-rest)`} />
        <g className={styles.dukeArmL}>
          <path d={icon.path} clipPath={`url(#${id}-l)`} />
        </g>
        <g className={styles.dukeArmR}>
          <path d={icon.path} clipPath={`url(#${id}-r)`} />
        </g>
        <circle cx="12" cy="9.75" r="2.2" className={styles.dukeNose} />
      </g>
      <text x="19" y="4.5" className={cx(styles.note, styles.note1)}>♪</text>
      <text x="22" y="7.5" className={cx(styles.note, styles.note2)}>♫</text>
    </Art>
  );
}

/* C: o hexágono gira em passos de 60°, como um compilador “clicando” no lugar */
function CArt({ icon }) {
  return (
    <Art style={{ color: `#${icon.hex}` }}>
      <g className={styles.cTick}>
        <path d={icon.path} fill="currentColor" />
      </g>
      <circle cx="12" cy="12" r="11" className={styles.cRing} />
    </Art>
  );
}

/* C++: o C desenha e os dois “+” são incrementados um de cada vez */
function CppArt({ icon }) {
  const color = `#${icon.hex}`;
  return (
    <Art>
      <path d={icon.path} fill={color} className={styles.cppBody} />
      <rect x="16.4" y="10.8" width="2.9" height="2.9" fill={color} className={cx(styles.cppCover, styles.cppCover1)} />
      <rect x="19.6" y="10.8" width="2.9" height="2.9" fill={color} className={cx(styles.cppCover, styles.cppCover2)} />
      <text x="17.85" y="9.4" className={cx(styles.cppPlusOne, styles.cppPlusOne1)}>+1</text>
      <text x="21.05" y="9.4" className={cx(styles.cppPlusOne, styles.cppPlusOne2)}>+1</text>
    </Art>
  );
}

/* PHP: jogado pra cima e girando como uma moeda */
function PhpArt({ icon }) {
  return (
    <Art className={styles.phpCoin} style={{ color: `#${icon.hex}` }}>
      <path d={icon.path} fill="currentColor" />
    </Art>
  );
}

/* ================= Front-end ================= */

/* React: núcleo pulsando, anéis balançando e elétrons correndo nas órbitas */
function ReactArt() {
  const orbit = 'M-11 0a11 4.2 0 1 0 22 0a11 4.2 0 1 0-22 0';
  const rings = [0, 60, 120];
  return (
    <Art viewBox="-12 -12 24 24" className={styles.reactAtom}>
      {rings.map((angle, i) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <g className={styles.reactRing} style={{ '--i': i }}>
            <ellipse rx="11" ry="4.2" className={styles.reactOrbit} />
            <circle r="1" className={styles.reactElectron}>
              <animateMotion dur={`${2.2 + i * 0.6}s`} repeatCount="indefinite" path={orbit} begin={`${i * -0.7}s`} />
            </circle>
          </g>
        </g>
      ))}
      <circle r="2.1" className={styles.reactCore} />
    </Art>
  );
}

/* HTML: as tags < > chegam pelos lados e fecham o escudo */
function HtmlArt({ icon }) {
  return (
    <Art>
      <path d="M3 7 -2 12 3 17" className={cx(styles.tag, styles.tagL)} />
      <path d="M21 7 26 12 21 17" className={cx(styles.tag, styles.tagR)} />
      <g className={styles.htmlShield}>
        <path d={icon.path} fill={`#${icon.hex}`} />
      </g>
    </Art>
  );
}

/* CSS: um pincel pinta o logo da esquerda pra direita passando por todas as cores */
function CssArt({ icon }) {
  const id = useSafeId();
  return (
    <Art>
      <clipPath id={id}>
        <rect x="-2" y="-2" width="28" height="28" className={styles.cssPaint} />
      </clipPath>
      <path d={icon.path} fill="none" stroke="var(--color-slate-700)" strokeWidth="0.3" />
      <g clipPath={`url(#${id})`}>
        <path d={icon.path} fill="#9b6bdf" className={styles.cssHue} />
      </g>
      <rect x="-0.6" y="-1" width="1.2" height="26" rx="0.6" className={styles.cssBrush} />
    </Art>
  );
}

const TW_TOP =
  'M12.001 4.8C8.801 4.8 6.801 6.4 6.001 9.6 7.201 8 8.601 7.4 10.201 7.8 11.114 8.028 11.766 8.69 12.489 9.424 13.666 10.618 15.027 12 18.001 12 21.201 12 23.201 10.4 24.001 7.2 22.801 8.8 21.401 9.4 19.801 9 18.888 8.772 18.236 8.11 17.513 7.376 16.337 6.182 14.976 4.8 12.001 4.8Z';
const TW_BOTTOM =
  'M6.001 12C2.801 12 0.801 13.6 0.001 16.8 1.201 15.2 2.601 14.6 4.201 15 5.114 15.228 5.766 15.89 6.489 16.624 7.666 17.818 9.027 19.2 12.001 19.2 15.201 19.2 17.201 17.6 18.001 14.4 16.801 16 15.401 16.6 13.801 16.2 12.888 15.972 12.236 15.31 11.513 14.576 10.337 13.382 8.976 12 6.001 12Z';

/* Tailwind: as duas ondas sopram como vento, com rajadas cruzando o card */
function TailwindArt({ icon }) {
  const color = `#${icon.hex}`;
  return (
    <Art>
      <path d="M-4 3.5H26" className={cx(styles.gust, styles.gust1)} />
      <path d="M-6 21H28" className={cx(styles.gust, styles.gust2)} />
      <path d="M-5 12.2H27" className={cx(styles.gust, styles.gust3)} />
      <g className={styles.twIn}>
        <g className={styles.twTop}>
          <path d={TW_TOP} fill={color} />
        </g>
        <g className={styles.twBottom}>
          <path d={TW_BOTTOM} fill={color} />
        </g>
      </g>
    </Art>
  );
}

/* Vite: o raio cai do céu, clareia tudo, solta faíscas e de vez em quando relampeja */
function ViteArt({ icon }) {
  const id = useSafeId();
  return (
    <Art>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#FFEA83" />
          <stop offset="0.45" stopColor="#FFDD35" />
          <stop offset="1" stopColor="#BD34FE" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="13" r="12" className={styles.viteFlash} />
      <g className={styles.viteFall}>
        <g className={styles.viteFlicker}>
          <path d={icon.path} fill={`url(#${id})`} />
        </g>
      </g>
      {[-70, -25, 25, 70].map((angle, i) => (
        <g key={angle} transform={`rotate(${angle} 12.3 23.4)`}>
          <path d="M12.3 22.6v-2.4" className={styles.viteSpark} style={{ '--i': i }} />
        </g>
      ))}
    </Art>
  );
}

/* ================= Back-end ================= */

/* Node.js: o hexágono se desenha e um ponto fica dando voltas, como o event loop */
function NodeArt({ icon }) {
  const loop = 'M12 -1.5a13.5 13.5 0 1 1 -0.01 0';
  return (
    <DrawArt
      icon={icon}
      extra={
        <>
          <circle cx="12" cy="12" r="13.5" className={styles.nodeTrack} />
          <circle r="0.9" className={styles.nodeTick}>
            <animateMotion dur="2.4s" repeatCount="indefinite" path={loop} />
          </circle>
        </>
      }
    />
  );
}

/* Express: entra a toda velocidade com linhas de vento e dá umas aceleradas */
function ExpressArt({ icon }) {
  return (
    <Art style={{ color: brandColor(icon) }}>
      <path d="M-6 7H4" className={cx(styles.speed, styles.speed1)} />
      <path d="M-8 12H2" className={cx(styles.speed, styles.speed2)} />
      <path d="M-6 17H4" className={cx(styles.speed, styles.speed3)} />
      <g className={styles.expressDash}>
        <path d={icon.path} fill="currentColor" />
      </g>
    </Art>
  );
}

/* Django: um vinil aparece girando e o “dj” faz scratch */
function DjangoArt({ icon }) {
  return (
    <Art style={{ color: brandColor(icon) }}>
      <g className={styles.vinyl}>
        <circle cx="12" cy="12" r="12.5" className={styles.vinylDisc} />
        <circle cx="12" cy="12" r="10" className={styles.vinylGroove} />
        <circle cx="12" cy="12" r="7.5" className={styles.vinylGroove} />
        <path d="M12 -0.5A12.5 12.5 0 0 1 22 5" className={styles.vinylShine} />
      </g>
      <g className={styles.djScratch}>
        <path d={icon.path} fill="currentColor" />
      </g>
    </Art>
  );
}

/* FastAPI: gira rápido com um rastro de velocidade e o raio (vazado) acende por trás */
function FastApiArt({ icon }) {
  return (
    <Art style={{ color: `#${icon.hex}` }}>
      <circle cx="12" cy="12" r="12.6" pathLength="1" className={styles.fastTrail} />
      <g className={styles.fastSpin}>
        <circle cx="12" cy="12" r="9" className={styles.fastGlow} />
        <path d={icon.path} fill="currentColor" />
      </g>
    </Art>
  );
}

/* REST APIs: uma requisição vai e a resposta volta, e as chaves do JSON fecham o texto */
function ApiArt() {
  return (
    <Mono text="API" size={6.4}>
      <text x="-1.2" y="12.4" dominantBaseline="middle" className={cx(styles.brace, styles.braceL)}>{'{'}</text>
      <text x="25.2" y="12.4" dominantBaseline="middle" textAnchor="end" className={cx(styles.brace, styles.braceR)}>{'}'}</text>
      <path d="M5 3.4h14M16.6 1.8l2.4 1.6-2.4 1.6" className={cx(styles.req, styles.reqOut)} />
      <path d="M19 20.6H5M7.4 19l-2.4 1.6 2.4 1.6" className={cx(styles.req, styles.reqBack)} />
    </Mono>
  );
}

/* ================= Dados & ML ================= */

/* PostgreSQL: o elefante abana as orelhas, ergue a tromba e solta um grito */
function PostgresArt({ icon }) {
  const id = useSafeId();
  const trunk = [11, 17.2, 8, 7];
  const earL = [-1, 0.5, 7.8, 16];
  const earR = [20, -1, 5, 14];
  return (
    <Art className={styles.white}>
      <defs>
        <ClipRest id={`${id}-rest`} rects={[trunk, earL, earR]} />
        <ClipRect id={`${id}-t`} rect={trunk} />
        <ClipRect id={`${id}-l`} rect={earL} />
        <ClipRect id={`${id}-r`} rect={earR} />
      </defs>
      <g className={styles.pgBody}>
        <path d={icon.path} clipPath={`url(#${id}-rest)`} />
        <g className={styles.pgEarL}>
          <path d={icon.path} clipPath={`url(#${id}-l)`} />
        </g>
        <g className={styles.pgEarR}>
          <path d={icon.path} clipPath={`url(#${id}-r)`} />
        </g>
        <g className={styles.pgTrunk}>
          <path d={icon.path} clipPath={`url(#${id}-t)`} />
        </g>
      </g>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${22 + i * 1.5} ${16.6 - i * 1.1}q${1.4 + i * 0.4} ${2.2 + i * 1.1} 0 ${4.4 + i * 2.2}`}
          className={styles.roar}
          style={{ '--i': i }}
        />
      ))}
    </Art>
  );
}

/* MySQL: o golfinho salta por cima do nome e mergulha de volta, espirrando água */
function MySqlArt({ icon }) {
  const id = useSafeId();
  const dolphin = [13.4, -1, 11, 13.6];
  return (
    <Art className={styles.white}>
      <defs>
        <ClipRest id={`${id}-rest`} rects={[dolphin]} />
        <ClipRect id={`${id}-d`} rect={dolphin} />
      </defs>
      <path d={icon.path} clipPath={`url(#${id}-rest)`} />
      <g className={styles.dolphin}>
        <path d={icon.path} clipPath={`url(#${id}-d)`} />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx="21" cy="12.5" r="0.45" className={styles.splash} style={{ '--i': i }} />
      ))}
    </Art>
  );
}

/* SQL Server: a query é digitada e as linhas do resultado vão aparecendo */
function SqlServerArt() {
  return (
    <Mono text="SQL" size={6.6}>
      {[0, 1, 2].map((i) => (
        <rect key={i} x="3" y={19.6 + i * 1.5} width={18 - i * 5} height="0.8" rx="0.4" className={styles.row} style={{ '--i': i }} />
      ))}
      <text x="2.6" y="3.6" className={styles.runLabel}>▶ RUN</text>
    </Mono>
  );
}

/* SQLite: a pena cai balançando como uma folha */
function SqliteArt({ icon }) {
  return (
    <Art style={{ color: brandColor(icon) }}>
      <g className={styles.featherFall}>
        <g className={styles.featherSway}>
          <path d={icon.path} fill="currentColor" />
        </g>
      </g>
    </Art>
  );
}

/* SQLAlchemy: a caligrafia é escrita na hora e borbulha como uma poção */
function SqlAlchemyArt({ icon }) {
  return (
    <DrawArt
      icon={icon}
      className={styles.alchemy}
      extra={[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={4 + i * 4} cy="20" r={0.5 + (i % 2) * 0.3} className={styles.bubble} style={{ '--i': i }} />
      ))}
    />
  );
}

/* pandas: o ícone sobe em colunas, como um gráfico de barras */
function PandasArt({ icon }) {
  const id = useSafeId();
  const cols = [0, 1, 2, 3, 4];
  return (
    <Art style={{ color: brandColor(icon) }}>
      <defs>
        {cols.map((i) => (
          <ClipRect key={i} id={`${id}-${i}`} rect={[i * 4.8, -1, 4.8, 26]} />
        ))}
      </defs>
      {cols.map((i) => (
        <g key={i} className={styles.pandasCol} style={{ '--i': i }}>
          <path d={icon.path} fill="currentColor" clipPath={`url(#${id}-${i})`} />
        </g>
      ))}
    </Art>
  );
}

/* NumPy: as quatro partes do cubo voam dos cantos e se encaixam */
function NumpyArt({ icon }) {
  const id = useSafeId();
  const quads = [
    [0, 0],
    [12, 0],
    [0, 12],
    [12, 12],
  ];
  return (
    <Art style={{ color: brandColor(icon) }}>
      <defs>
        {quads.map(([x, y], i) => (
          <ClipRect key={i} id={`${id}-${i}`} rect={[x ? 12 : -1, y ? 12 : -1, 13, 13]} />
        ))}
      </defs>
      {quads.map((_, i) => (
        <g key={i} className={cx(styles.npPiece, styles[`npPiece${i}`])}>
          <path d={icon.path} fill="currentColor" clipPath={`url(#${id}-${i})`} />
        </g>
      ))}
    </Art>
  );
}

/* scikit-learn: pontos espalhados se agrupam (clustering) e viram o logo */
function SklearnArt({ icon }) {
  const points = [
    [-3, -2], [26, 1], [-2, 25], [25, 23], [12, -4], [-5, 12],
    [28, 12], [12, 28], [4, -3], [21, 27], [-4, 5], [27, 18],
  ];
  return (
    <Art>
      {points.map(([x, y], i) => (
        <circle
          key={i}
          r="0.9"
          cx="12"
          cy="12"
          className={styles.cluster}
          fill={i % 2 ? '#29ABE2' : '#F7931E'}
          style={{ '--x': `${x - 12}px`, '--y': `${y - 12}px`, '--i': i }}
        />
      ))}
      <g className={styles.sklearnPop}>
        <path d={icon.path} fill={`#${icon.hex}`} />
      </g>
    </Art>
  );
}

/* matplotlib: um gráfico é plotado na hora, ponto por ponto */
function MatplotlibArt() {
  const pts = [
    [3, 16],
    [7, 9],
    [11, 13],
    [15, 6],
    [20, 10],
  ];
  return (
    <Art>
      <path d="M2 3v18h20" className={styles.axes} />
      <path d="M3 16C5 11 6 9 7 9s3 4 4 4 3-7 4-7 4 4 5 4" pathLength="1" className={styles.plotLine} />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9" className={styles.plotDot} style={{ '--i': i }} />
      ))}
      <text x="22" y="3.4" textAnchor="end" className={styles.pltLabel}>plt</text>
    </Art>
  );
}

/* ================= Ferramentas ================= */

/* Git: as duas metades chegam de lados opostos e fazem merge */
function GitArt({ icon }) {
  const id = useSafeId();
  return (
    <Art style={{ color: `#${icon.hex}` }}>
      <defs>
        <ClipRect id={`${id}-l`} rect={[-1, -1, 13, 26]} />
        <ClipRect id={`${id}-r`} rect={[12, -1, 13, 26]} />
      </defs>
      <g className={styles.gitLeft}>
        <path d={icon.path} fill="currentColor" clipPath={`url(#${id}-l)`} />
      </g>
      <g className={styles.gitRight}>
        <path d={icon.path} fill="currentColor" clipPath={`url(#${id}-r)`} />
      </g>
      <circle cx="12" cy="12" r="3" className={styles.gitMerge} />
    </Art>
  );
}

/* GitHub: o Octocat pula, abre os olhos, pisca e olha pros lados */
function GithubArt({ icon }) {
  return (
    <Art className={styles.white}>
      <g className={styles.octoBounce}>
        <path d={icon.path} />
        <g className={styles.octoLook}>
          <ellipse cx="9.6" cy="11.6" rx="0.75" ry="1.1" className={styles.octoEye} />
          <ellipse cx="14.4" cy="11.6" rx="0.75" ry="1.1" className={styles.octoEye} />
        </g>
      </g>
    </Art>
  );
}

/* Docker: os containers são empilhados um a um, a baleia boia e bate o rabo */
function DockerArt({ icon }) {
  const id = useSafeId();
  const tail = [19.2, 5.5, 5.5, 6];
  const rows = [
    [1.5, 8.6, 15, 2.7],
    [4.5, 5.9, 9.5, 2.6],
    [10, 3, 4, 2.8],
  ];
  return (
    <Art className={styles.white}>
      <defs>
        <ClipRest id={`${id}-rest`} rects={[tail, ...rows]} />
        <ClipRect id={`${id}-tail`} rect={tail} />
        {rows.map((r, i) => (
          <ClipRect key={i} id={`${id}-row${i}`} rect={r} />
        ))}
      </defs>
      <g className={styles.whaleFloat}>
        <path d={icon.path} clipPath={`url(#${id}-rest)`} />
        <g className={styles.whaleTail}>
          <path d={icon.path} clipPath={`url(#${id}-tail)`} />
        </g>
        {rows.map((_, i) => (
          <g key={i} className={styles.container} style={{ '--i': i }}>
            <path d={icon.path} clipPath={`url(#${id}-row${i})`} />
          </g>
        ))}
      </g>
      <path d="M-1 23.6q2-1 4 0t4 0 4 0 4 0 4 0 4 0" className={styles.water} />
    </Art>
  );
}

/* Vercel: o triângulo decola como um foguete, pousa e reflete a luz */
function VercelArt({ icon }) {
  const id = useSafeId();
  return (
    <Art style={{ color: brandColor(icon) }}>
      <clipPath id={id}>
        <path d={icon.path} />
      </clipPath>
      <g className={styles.rocket}>
        <path d="M8 22.5v3M12 22.5v5M16 22.5v3" className={styles.exhaust} />
        <path d={icon.path} fill="currentColor" />
        <g clipPath={`url(#${id})`}>
          <rect x="-8" y="-2" width="4" height="28" className={styles.glint} />
        </g>
      </g>
    </Art>
  );
}

/* Render: a imagem é renderizada linha por linha com um scanner passando */
function RenderArt({ icon }) {
  const id = useSafeId();
  return (
    <Art style={{ color: brandColor(icon) }}>
      <clipPath id={id}>
        <rect x="-1" y="-1" width="26" height="26" className={styles.renderReveal} />
      </clipPath>
      <path d={icon.path} fill="none" stroke="var(--color-slate-700)" strokeWidth="0.25" strokeDasharray="0.6 0.6" />
      <path d={icon.path} fill="currentColor" clipPath={`url(#${id})`} />
      <rect x="-2" y="-0.4" width="28" height="0.8" rx="0.4" className={styles.scanline} />
    </Art>
  );
}

/* Neon: acende piscando como um letreiro de neon */
function NeonArt({ icon }) {
  return (
    <Art className={styles.neonTube} style={{ color: `#${icon.hex}` }}>
      <path d={icon.path} fill="currentColor" />
    </Art>
  );
}

/* Excel: as células da planilha aparecem e a seleção percorre a grade */
function ExcelArt() {
  return (
    <Mono
      text="XLS"
      size={6}
      before={
        <>
          <rect x="1.5" y="6" width="7" height="6" className={styles.cellSelect} />
          <path d="M8.5 6v12M15.5 6v12M1.5 12h21" className={styles.gridLines} pathLength="1" />
        </>
      }
    />
  );
}

/* GLPI: carimbado como um chamado aberto */
function GlpiArt() {
  return <Mono text="GLPI" size={5.4} className={styles.stamp} textClass={styles.stampText} />;
}

/* Linear: as faixas diagonais são reveladas por uma varredura, com um anel de progresso */
function LinearArt({ icon }) {
  const id = useSafeId();
  return (
    <Art style={{ color: `#${icon.hex}` }}>
      <clipPath id={id}>
        <path d="M-30 -30 54 54H-30Z" className={styles.linearWipe} />
      </clipPath>
      <circle cx="12" cy="12" r="12.8" pathLength="1" transform="rotate(-90 12 12)" className={styles.linearProgress} />
      <path d={icon.path} fill="currentColor" clipPath={`url(#${id})`} />
    </Art>
  );
}

/* Wiki.js: a borboleta chega voando, batendo as asas, e fica pousada batendo de vez em quando */
function WikiArt({ icon }) {
  const id = useSafeId();
  const left = [-1, -1, 12.1, 26];
  const right = [12.4, -1, 12.6, 26];
  return (
    <Art className={styles.white}>
      <defs>
        <ClipRest id={`${id}-rest`} rects={[left, right]} />
        <ClipRect id={`${id}-l`} rect={left} />
        <ClipRect id={`${id}-r`} rect={right} />
      </defs>
      <g className={styles.flyIn}>
        <g className={styles.flutter}>
          <g className={styles.wingL}>
            <path d={icon.path} clipPath={`url(#${id}-l)`} />
          </g>
          <g className={styles.wingR}>
            <path d={icon.path} clipPath={`url(#${id}-r)`} />
          </g>
          <path d={icon.path} clipPath={`url(#${id}-rest)`} />
        </g>
      </g>
    </Art>
  );
}

/* Contentful: revelado como um relógio, e as bolinhas (vazadas) acendem por trás */
function ContentfulArt({ icon }) {
  const id = useSafeId();
  return (
    <Art style={{ color: `#${icon.hex}` }}>
      <mask id={id} maskUnits="userSpaceOnUse" x="-2" y="-2" width="28" height="28">
        <circle cx="12" cy="12" r="7" pathLength="1" className={styles.clockWipe} transform="rotate(-90 12 12)" />
      </mask>
      {[
        [6, 6],
        [6, 18.3],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" className={styles.contentDot} fill={i ? '#EE4C52' : '#FFDA00'} style={{ '--i': i }} />
      ))}
      <path d={icon.path} fill="currentColor" mask={`url(#${id})`} />
    </Art>
  );
}

/* Zabbix: um eletrocardiograma corre pela caixa monitorando tudo */
function ZabbixArt() {
  return (
    <Mono text="ZBX" size={6.2} className={styles.zabbix}>
      <path d="M1.5 3h6l1-2 1.4 4 1.2-4.5 1 2.5h11.4" pathLength="1" className={styles.ekg} />
    </Mono>
  );
}

/* Grafana: gira como uma engrenagem acelerando e fica rodando devagar */
function GrafanaArt({ icon }) {
  return (
    <Art style={{ color: `#${icon.hex}` }}>
      <g className={styles.gearIn}>
        <g className={styles.gearIdle}>
          <path d={icon.path} fill="currentColor" />
        </g>
      </g>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={24.4 + i * 1.3} y={20 - i * 2} width="0.9" height={2 + i * 2} rx="0.3" className={styles.metric} style={{ '--i': i }} />
      ))}
    </Art>
  );
}

/* Azure: uma nuvem passa e deixa o nome para trás */
function AzureArt() {
  return (
    <Mono text="AZ" size={7} className={styles.azure}>
      <path
        d="M4 14.5a3 3 0 0 1 .6-5.9 4.2 4.2 0 0 1 8-1 3.4 3.4 0 0 1 4.6 3.2 2.4 2.4 0 0 1-.2 3.7Z"
        className={styles.cloud}
      />
    </Mono>
  );
}

/* Mapa de nome → animação. */
const ART = {
  Python: { Component: PythonArt },
  JavaScript: { Component: JavaScriptArt },
  TypeScript: { Component: DrawArt },
  Java: { Component: JavaArt },
  C: { Component: CArt },
  'C++': { Component: CppArt },
  PHP: { Component: PhpArt },
  React: { Component: ReactArt },
  HTML: { Component: HtmlArt },
  CSS: { Component: CssArt },
  'Tailwind CSS': { Component: TailwindArt },
  Vite: { Component: ViteArt },
  'Node.js': { Component: NodeArt },
  Express: { Component: ExpressArt },
  Django: { Component: DjangoArt },
  FastAPI: { Component: FastApiArt },
  'REST APIs': { Component: ApiArt },
  PostgreSQL: { Component: PostgresArt },
  MySQL: { Component: MySqlArt },
  'SQL Server': { Component: SqlServerArt },
  SQLite: { Component: SqliteArt },
  SQLAlchemy: { Component: SqlAlchemyArt },
  pandas: { Component: PandasArt },
  NumPy: { Component: NumpyArt },
  'scikit-learn': { Component: SklearnArt },
  matplotlib: { Component: MatplotlibArt },
  Git: { Component: GitArt },
  GitHub: { Component: GithubArt },
  Docker: { Component: DockerArt },
  Vercel: { Component: VercelArt },
  Render: { Component: RenderArt },
  Neon: { Component: NeonArt },
  Excel: { Component: ExcelArt },
  GLPI: { Component: GlpiArt },
  Linear: { Component: LinearArt },
  'Wiki.js': { Component: WikiArt },
  Contentful: { Component: ContentfulArt },
  Zabbix: { Component: ZabbixArt },
  Grafana: { Component: GrafanaArt },
  Azure: { Component: AzureArt },
};


export default function SkillArt({ skill }) {
  const entry = ART[skill.name];
  if (entry) return <entry.Component icon={skill.icon} />;
  if (skill.icon) return <DrawArt icon={skill.icon} />;
  return <Mono text={skill.monogram} />;
}
