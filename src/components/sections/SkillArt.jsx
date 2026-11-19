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


const AZURE_PATH =
  'M22.379 23.343a1.62 1.62 0 0 0 1.536-2.14v.002L17.35 1.76A1.62 1.62 0 0 0 15.816.657H8.184A1.62 1.62 0 0 0 6.65 1.76L.086 21.204a1.62 1.62 0 0 0 1.536 2.139h4.741a1.62 1.62 0 0 0 1.535-1.103l.977-2.892l4.947 3.675c.28.208.618.32.966.32m-3.084-12.531l3.624 10.739a.54.54 0 0 1-.51.713v-.001h-.03a.54.54 0 0 1-.322-.106l-9.287-6.9h4.853m6.313 7.006c.116-.326.13-.694.007-1.058L9.79 1.76l-.007-.02h6.034a.54.54 0 0 1 .512.366l6.562 19.445a.54.54 0 0 1-.338.684';
const EXCEL_PATH =
  'M23 1.5q.41 0 .7.3q.3.29.3.7v19q0 .41-.3.7q-.29.3-.7.3H7q-.41 0-.7-.3q-.3-.29-.3-.7V18H1q-.41 0-.7-.3q-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7q.29-.3.7-.3zM6 13.28l1.42 2.66h2.14l-2.38-3.87l2.34-3.8H7.46l-1.3 2.4l-.05.08l-.04.09l-.64-1.28l-.66-1.29H2.59l2.27 3.82l-2.48 3.85h2.16zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3Z';
const ZABBIX_Z = 'M21.943 20.419H96v9.752L36.267 103.01h61.257v10.666H20.419v-9.752l59.733-72.838h-58.21z';

/* Logo oficial do GLPI (repositório glpi-project), separado por letra */
const GLPI = {
  g: 'M33.63,73.6A52.48,52.48,0,0,1,16,66.42a30.43,30.43,0,0,1-1.14-50.1C23.89,9.7,34.4,7,45.24,5.39A111.91,111.91,0,0,1,69,4.2c2.74.18,3.7,1.26,3.56,4-.14,2.9-1.88,2.59-3.91,2.58-8.2,0-16.28.75-24.08,3.58-13.09,4.76-19.74,13.5-19.68,26C24.9,53.05,31.37,61.21,45,65.78c3.21.25,6.58-.22,9.39,2a54.86,54.86,0,0,0,13.41.89c2.53-.08,3.35.91,3.27,3.32-.06,2.15,0,3.67-3,3.94-9.12.81-18.16.09-27.22-.77C38.24,75.64,35.72,75.63,33.63,73.6Z',
  gInner: 'M54.41,67.75a37.67,37.67,0,0,1-9.39-2c8-4.51,13.42-11,15.51-20,.55-2.42-1.11-3.69-3.17-4.45-4.16-1.54-8.53-1.69-12.89-1.85a63.55,63.55,0,0,1-6.58-.32A85.25,85.25,0,0,1,58.75,33,29,29,0,0,1,70,33c5.11,1.2,7.72,5.21,6.54,10.3-1.83,7.91-7.76,12.78-13.38,17.82C60.45,63.59,57.34,65.57,54.41,67.75Z',
  l: 'M105.3,75.69c-4.74,0-9.47-.14-14.2,0-2.95.12-4-.67-3.55-3.85,2.87-19.76,5.58-39.55,8.35-59.33.07-.47.18-.93.24-1.4,1-7.24,1-7.15,8.2-7,2.72.05,3.56,1.07,3.17,3.67C106,18.45,104.46,29.1,103,39.75c-1.13,8-2.15,15.93-3.38,23.88-.31,2,.23,2.45,2.11,2.43,6.51-.08,13,.07,19.53-.07,2.76-.07,3.83.72,3.49,3.65-.68,5.84-.77,6-6.63,6Z',
  p: 'M138.84,75.69c-5.28,0-5.21,0-4.44-5.43,2.93-20.72,5.88-41.44,8.65-62.19.41-3.08,1.69-4,4.56-3.92,5.45.13,10.91.29,16.34,0,15.17-.86,21.7,12.36,20.26,23.16C182.38,41,172.12,50,158.25,50h-1.43c-9.13,0-9.1,0-10.14,9.28-.4,3.65-1,7.26-1.48,10.9C144.49,75.67,144.49,75.69,138.84,75.69ZM156.2,39.73c-6.65,0-6.71,0-5.91-6.56.66-5.39,1.54-10.76,2.18-16.15.23-1.93,1-2.61,2.94-2.51,2.71.14,5.44,0,8.16,0,5.39,0,8.77,3.09,9.59,8.45,1.14,7.32-3.92,17.73-14.48,16.74C157.86,39.66,157,39.73,156.2,39.73Z',
  i: 'M195,75.69c-5.31,0-5.3-.11-4.54-5.38q4.49-31.22,8.78-62.46c.36-2.65,1.32-3.9,4-3.67.47,0,.94,0,1.42,0,6,0,5.84,0,5,6-2.88,20.1-5.63,40.23-8.5,60.34C200.35,75.7,200.23,75.69,195,75.69Z',
  tail: [
    { fill: '#82d3f8', d: 'M33.63,73.6l7.23,1.53a153.31,153.31,0,0,1-27.78,12c-.76.29-.87-.07-.72-.71,6-3.27,12.07-6.5,18.05-9.86C31.66,75.82,33.43,75.51,33.63,73.6Z' },
    { fill: '#a3defa', d: 'M11,87.86a5.31,5.31,0,0,1-3.25,1.08c.42-1.3,1.58-1.34,2.46-1.78C10.53,87.38,11,87.42,11,87.86Z' },
    { fill: '#97daf9', d: 'M11,87.86l-.79-.7,2.11-.79.72.71A2.47,2.47,0,0,1,11,87.86Z' },
  ],
};

/* Wiki.js: camadas das asas (de trás pra frente); quanto mais atrás, mais transparente */
const WIKI_WINGS = [
  { side: 'r', depth: 3, opacity: 0.6, d: 'M17.233 11.231C16.424 11.613 15.554 11.879 14.726 11.879 14.254 11.879 13.893 11.897 13.587 11.918V11.919C13.263 11.888 12.922 11.88 12.568 11.865A3.555 3.555 0 0 1 12.416 11.856C12.518 11.854 12.608 11.85 12.665 11.85 13.028 11.85 14.327 11.884 15.816 11.261 17.324 10.629 18.461 9.488 18.952 7.91 19.322 6.724 19.262 5.508 19.038 4.598 19.496 4.262 19.898 3.947 20.185 3.688 20.686 3.237 20.928 2.955 21.033 2.819 21.232 3.025 21.747 3.683 21.718 4.957 21.682 6.568 21.112 8.144 20.217 9.111A9.099 9.099 0 0 1 18.896 10.243 11.978 11.978 0 0 0 18.252 9.821L18.163 9.766 18.112 9.857C17.928 10.189 17.612 10.682 17.233 11.231Z' },
  { side: 'l', depth: 3, opacity: 0.6, d: 'M4.763 5.817C4.606 6.961 4.876 8.14 5.415 8.916 5.954 9.692 7.503 11.206 9.029 11.421 10.02 11.561 11.084 11.555 11.084 11.555S10.491 10.979 9.97 9.895C9.449 8.81 9.022 7.791 8.236 7.109 7.451 6.428 6.635 5.693 6.191 5.164 5.747 4.634 5.601 4.304 5.601 4.304S4.945 4.479 4.763 5.817Z' },
  { side: 'r', depth: 3, opacity: 0.6, d: 'M19.064 10.366A9.162 9.162 0 0 0 20.364 9.246C20.69 8.894 20.975 8.464 21.209 7.981 22.524 8.126 23.608 8.352 24 8.415 24 8.415 23.321 10.386 20.055 11.437L20.039 11.402C19.918 11.142 19.654 10.808 19.064 10.366Z' },
  { side: 'l', depth: 3, opacity: 0.6, d: 'M7.43 11.225A8.537 8.537 0 0 1 6.832 11.001C5.175 10.308 3.922 9.057 3.383 7.323 2.885 5.722 3.091 4.072 3.474 3.054 3.699 3.598 4.232 4.394 4.736 5.064A3.58 3.58 0 0 0 4.564 5.79C4.401 6.987 4.687 8.218 5.251 9.03 5.667 9.629 6.668 10.65 7.806 11.223 7.678 11.225 7.553 11.226 7.43 11.225Z' },
  { side: 'l', depth: 3, opacity: 0.6, d: 'M5.672 11.148C4.714 10.807 3.771 10.361 2.975 9.78-0.07 7.559 0 6.827 0 6.827S1.558 6.822 3.088 7.006C3.118 7.132 3.153 7.257 3.192 7.383 3.749 9.174 5.043 10.469 6.754 11.186L6.801 11.205A4.254 4.254 0 0 1 6.534 11.179H6.533C6.132 11.126 5.938 11.044 5.938 11.044L5.781 10.975 5.689 11.119 5.672 11.148Z' },
  { side: 'r', depth: 2, opacity: 0.42, d: 'M17.801 13.557C17.949 13.655 18.089 13.759 18.218 13.87 20.072 15.47 21.345 18.526 20.8 21.181 19.709 20.926 15.053 20.126 13.162 17.798 12.252 16.678 11.796 15.717 11.593 14.913A5.65 5.65 0 0 0 11.627 14.694C11.716 14.892 11.824 15.044 11.94 15.16 12.18 15.4 12.461 15.495 12.706 15.532 13.01 15.578 13.3 15.526 13.512 15.464L13.513 15.465C13.563 15.45 13.946 15.349 14.373 15.123 14.698 14.95 16.381 14.192 17.801 13.557Z' },
  { side: 'l', depth: 2, opacity: 0.42, d: 'M10.417 14.992C9.156 16.597 6.6 18.939 0.614 18.417 0.833 16.925 1.924 15.398 3.124 14.307 3.503 13.962 4.03 13.615 4.63 13.298 4.916 13.466 5.228 13.63 5.569 13.784 8.258 15.005 9.472 14.785 10.459 14.357A1.3 1.3 0 0 0 10.513 14.332 6.156 6.156 0 0 0 10.417 14.992Z' },
  { side: 'l', depth: 1, opacity: 0.8, d: 'M13.449 15.275C13.261 15.33 13.004 15.375 12.736 15.334 12.526 15.303 12.286 15.224 12.081 15.018 11.912 14.85 11.769 14.599 11.68 14.229A9.837 9.837 0 0 0 11.719 13.409L11.768 13.166C12.331 14.021 13.633 14.564 14.244 14.688 14.28 14.696 14.316 14.702 14.353 14.708L14.34 14.717C13.761 15.132 13.58 15.22 13.449 15.275Z' },
  { side: 'r', depth: 1, opacity: 0.8, d: 'M19.782 12.457C19.525 12.571 15.671 14.279 14.536 14.82 15.516 14.045 17.553 11.23 18.235 10.046 19.297 10.707 19.703 11.155 19.858 11.487 19.959 11.704 19.948 11.867 19.954 12.002A0.57 0.57 0 0 1 19.782 12.457Z' },
  { side: 'l', depth: 1, opacity: 0.8, d: 'M10.569 14.077A1.606 1.606 0 0 1 10.379 14.173C9.425 14.587 8.253 14.783 5.651 13.602 3.628 12.684 2.627 11.445 2.28 10.936 2.756 11.097 3.751 11.409 4.437 11.46 4.719 11.481 5.14 11.528 5.604 11.585 5.625 11.794 5.713 12.071 5.949 12.414L5.95 12.415C6.401 13.066 7.084 13.534 7.715 13.677 8.337 13.818 9.798 13.859 10.657 13.27A3.12 3.12 0 0 0 10.789 13.177L10.79 13.356A6.052 6.052 0 0 0 10.569 14.077Z' },
  { side: 'r', depth: 1, opacity: 0.8, d: 'M16.081 12.806A17.49 17.49 0 0 1 14.755 12.217C15.192 12.259 15.809 12.3 16.447 12.325 16.326 12.487 16.203 12.648 16.081 12.806Z' },
  { side: 'r', depth: 1, opacity: 0.8, d: 'M17.013 11.546C16.893 11.716 16.768 11.889 16.64 12.063 16.399 12.081 16.162 12.093 15.931 12.101A29.05 29.05 0 0 1 15.19 12.053C15.798 11.988 16.418 11.801 17.013 11.546Z' },
  { side: 'r', depth: 1, opacity: 0.8, d: 'M17.119 5.926A9.875 9.875 0 0 1 16.523 6.631C16.219 6.946 15.32 7.807 14.56 8.547 15.207 7.592 15.863 6.741 16.744 6.171 16.867 6.091 16.993 6.01 17.119 5.926Z' },
];
const WIKI_FRONT =
  'M14.569 14.53C14.949 14.189 15.446 13.614 15.952 12.971 15.563 12.821 15.086 12.6 14.633 12.38 14.035 12.09 13.328 12.097 12.56 12.065A4.685 4.685 0 0 1 11.756 11.962C11.77 11.839 11.783 11.716 11.794 11.593 11.856 11.697 12.467 11.65 12.665 11.65 13.019 11.65 14.286 11.684 15.739 11.076 17.191 10.468 18.289 9.37 18.761 7.851 19.235 6.331 18.981 4.76 18.593 3.899 18.424 4.608 17.14 6.28 16.667 6.77 16.194 7.259 14.286 9.066 13.695 9.691 12.995 10.431 13.007 10.484 12.363 10.993 12.161 11.183 11.864 11.395 11.8 11.523 11.827 11.185 11.839 10.848 11.827 10.526A7.653 7.653 0 0 0 11.795 10.003C12.117 9.944 12.362 9.481 12.362 9.142 12.362 8.918 12.256 8.895 12.091 8.913 12.166 8.019 12.473 4.99 13.345 4.632 13.563 4.741 14.176 4.7 13.994 4.337 13.812 3.973 13.169 4.263 12.913 4.603 12.633 4.977 11.957 6.649 11.993 8.927 11.88 8.941 11.819 8.96 11.671 8.96 11.5 8.96 11.35 8.92 11.238 8.91 11.272 6.635 10.524 5.138 10.398 4.741 10.278 4.366 9.907 4.145 9.617 4.145 9.471 4.145 9.345 4.201 9.284 4.324 9.102 4.687 9.743 4.741 9.961 4.632 10.667 4.953 11.117 8.151 11.215 8.909 11.09 8.903 11.016 8.944 11.016 9.142 11.016 9.453 11.186 9.898 11.468 9.985A0.442 0.442 0 0 0 11.461 10.015S11.174 11.005 11.048 12.204A4.665 4.665 0 0 1 10.33 11.979C9.616 11.693 8.975 11.396 8.311 11.413 7.647 11.431 6.945 11.436 6.507 11.377 6.069 11.319 5.858 11.227 5.858 11.227S5.624 11.592 6.115 12.302C6.535 12.909 7.17 13.349 7.759 13.482 8.348 13.616 9.731 13.662 10.544 13.105 10.704 12.996 10.861 12.877 11.003 12.765A8.717 8.717 0 0 0 10.99 13.391C10.701 14.144 10.419 15.384 10.722 16.729 10.722 16.728 11.423 15.887 11.509 13.771 11.515 13.627 11.518 13.5 11.519 13.388 11.571 13.14 11.622 12.87 11.667 12.589 11.739 12.724 11.818 12.866 11.901 13.002 12.412 13.844 13.692 14.372 14.284 14.492 14.375 14.511 14.471 14.524 14.569 14.53ZM12.479 9.558C12.565 9.575 12.615 9.616 12.615 9.703 12.615 9.9 12.373 10.203 12.018 10.3L12.008 10.139A0.887 0.887 0 0 0 12.291 9.896C12.369 9.797 12.433 9.679 12.479 9.558ZM10.888 9.564C10.921 9.664 10.964 9.761 11.017 9.846 11.078 9.943 11.151 10.026 11.234 10.086L11.213 10.169C10.937 10.076 10.789 9.876 10.789 9.703 10.789 9.625 10.824 9.584 10.888 9.564ZM10.863 8.9C10.588 8.084 10.068 6.878 9.358 6.721 9.062 6.793 8.42 6.817 8.667 6.576 8.913 6.336 9.752 6.528 9.95 6.793 10.095 6.987 10.694 7.599 10.961 8.53L10.993 8.757A0.324 0.324 0 0 0 10.863 8.9ZM12.317 8.634C12.568 7.644 13.206 6.995 13.356 6.793 13.553 6.528 14.392 6.336 14.639 6.576 14.886 6.817 14.244 6.793 13.948 6.721 13.258 6.873 12.748 8.017 12.467 8.83A0.364 0.364 0 0 0 12.4 8.771 0.37 0.37 0 0 0 12.308 8.728L12.317 8.634Z';

/* MySQL separado em duas partes: o nome e o golfinho */
const MYSQL_TEXT =
  'M16.405 5.501C16.29 5.501 16.212 5.515 16.131 5.534V5.547H16.145C16.199 5.651 16.291 5.727 16.359 5.82 16.413 5.927 16.459 6.034 16.513 6.14L16.527 6.125C16.621 6.059 16.667 5.953 16.667 5.792 16.627 5.745 16.621 5.698 16.587 5.652 16.547 5.585 16.461 5.552 16.407 5.499ZM5.77 18.695H4.843A50.854 50.854 0 0 0 4.573 14.285H4.565L3.155 18.695H2.45L1.05 14.285H1.04A72.892 72.892 0 0 0 0.845 18.695H0C0.055 16.729 0.192 14.885 0.41 13.165H1.56L2.895 17.229H2.903L4.25 13.165H5.345C5.587 15.18 5.729 17.025 5.773 18.695ZM9.787 14.615C9.409 16.66 8.911 18.148 8.295 19.075 7.813 19.791 7.285 20.148 6.712 20.148 6.559 20.148 6.372 20.102 6.146 20.01V19.516C6.256 19.533 6.386 19.542 6.532 19.542 6.8 19.542 7.015 19.467 7.179 19.32 7.376 19.14 7.474 18.938 7.474 18.715 7.474 18.56 7.397 18.245 7.244 17.771L6.23 14.615H7.14L7.867 16.975C8.031 17.511 8.1 17.885 8.072 18.098 8.472 17.034 8.75 15.871 8.907 14.615ZM22.112 18.695H19.482V13.165H20.367V18.015H22.112ZM18.792 18.83L17.776 18.33C17.866 18.254 17.953 18.172 18.031 18.08 18.464 17.574 18.679 16.822 18.679 15.827 18.679 13.997 17.961 13.081 16.524 13.081 15.82 13.081 15.27 13.313 14.874 13.778 14.444 14.286 14.228 15.034 14.228 16.023 14.228 16.995 14.418 17.709 14.802 18.163 15.152 18.573 15.679 18.778 16.385 18.778 16.649 18.778 16.891 18.745 17.11 18.68L18.435 19.452 18.795 18.83ZM15.5 17.588C15.275 17.228 15.163 16.648 15.163 15.852 15.163 14.459 15.587 13.762 16.433 13.762 16.876 13.762 17.203 13.929 17.41 14.262 17.634 14.624 17.746 15.198 17.746 15.985 17.746 17.389 17.322 18.093 16.476 18.093 16.031 18.093 15.706 17.926 15.498 17.593ZM13.842 17.163C13.842 17.633 13.67 18.019 13.326 18.319 12.982 18.619 12.523 18.769 11.942 18.769 11.399 18.769 10.878 18.597 10.369 18.254L10.606 17.778C11.044 17.998 11.439 18.106 11.796 18.106 12.128 18.106 12.389 18.033 12.579 17.886A0.754 0.754 0 0 0 12.879 17.271C12.879 16.941 12.649 16.661 12.231 16.426 11.843 16.213 11.068 15.769 11.068 15.769 10.646 15.462 10.436 15.133 10.436 14.592 10.436 14.142 10.593 13.782 10.906 13.507 11.221 13.229 11.626 13.092 12.126 13.092 12.638 13.092 13.106 13.228 13.526 13.502L13.313 13.978A2.726 2.726 0 0 0 12.249 13.748C11.966 13.748 11.747 13.816 11.595 13.954A0.685 0.685 0 0 0 11.347 14.478C11.347 14.806 11.581 15.088 12.013 15.328 12.406 15.543 13.2 15.998 13.2 15.998 13.633 16.303 13.848 16.628 13.848 17.166Z';
const MYSQL_DOLPHIN =
  'M23.224 11.311C22.689 11.297 22.274 11.351 21.927 11.499 21.827 11.539 21.667 11.539 21.653 11.666 21.708 11.719 21.716 11.806 21.763 11.88 21.843 12.014 21.981 12.193 22.109 12.287 22.249 12.397 22.389 12.503 22.536 12.597 22.796 12.757 23.091 12.852 23.346 13.013 23.491 13.107 23.639 13.226 23.786 13.326 23.859 13.376 23.906 13.466 24 13.498V13.478C23.954 13.418 23.94 13.331 23.895 13.264 23.828 13.197 23.761 13.137 23.695 13.071A3.223 3.223 0 0 0 23 12.396C22.786 12.25 22.318 12.046 22.23 11.801L22.217 11.787C22.363 11.774 22.537 11.721 22.677 11.681 22.904 11.621 23.112 11.634 23.347 11.575 23.453 11.548 23.56 11.515 23.667 11.481V11.421C23.547 11.301 23.457 11.138 23.333 11.026A8.867 8.867 0 0 0 22.229 10.203C22.019 10.069 21.753 9.983 21.532 9.869 21.452 9.829 21.318 9.809 21.272 9.742 21.152 9.596 21.082 9.402 20.997 9.228A17.69 17.69 0 0 1 20.45 8.065C20.33 7.803 20.257 7.542 20.11 7.302 19.42 6.165 18.673 5.476 17.524 4.802 17.277 4.662 16.981 4.602 16.668 4.528 16.501 4.52 16.334 4.508 16.168 4.501 16.058 4.454 15.952 4.327 15.858 4.266 15.478 4.026 14.494 3.506 14.214 4.194 14.034 4.628 14.481 5.056 14.636 5.276 14.751 5.429 14.896 5.604 14.976 5.776 15.023 5.892 15.036 6.011 15.083 6.132 15.189 6.426 15.29 6.754 15.43 7.029 15.503 7.169 15.583 7.316 15.677 7.442 15.731 7.515 15.823 7.549 15.844 7.669 15.75 7.805 15.744 8.003 15.69 8.169 15.45 8.926 15.544 9.862 15.884 10.419 15.991 10.585 16.246 10.953 16.587 10.812 16.887 10.692 16.821 10.312 16.907 9.977 16.927 9.897 16.914 9.844 16.955 9.79V9.805C17.049 9.993 17.143 10.172 17.229 10.36 17.435 10.688 17.795 11.028 18.096 11.255 18.256 11.375 18.383 11.583 18.583 11.657V11.637H18.568C18.525 11.579 18.468 11.551 18.414 11.504A3.445 3.445 0 0 1 18.064 11.104 8.76 8.76 0 0 1 17.317 9.886C17.207 9.676 17.115 9.45 17.027 9.243 16.987 9.163 16.987 9.043 16.92 9.003 16.82 9.149 16.673 9.276 16.6 9.456 16.473 9.744 16.46 10.098 16.412 10.466 16.385 10.473 16.398 10.466 16.385 10.48 16.171 10.428 16.098 10.206 16.018 10.02 15.818 9.545 15.785 8.782 15.958 8.235 16.005 8.095 16.205 7.653 16.125 7.519 16.083 7.392 15.951 7.319 15.878 7.216A2.478 2.478 0 0 1 15.638 6.789C15.478 6.415 15.398 6.001 15.224 5.627 15.144 5.454 15.004 5.273 14.89 5.114 14.763 4.934 14.623 4.807 14.522 4.594 14.489 4.521 14.442 4.4 14.495 4.32 14.509 4.266 14.537 4.245 14.589 4.23 14.677 4.158 14.924 4.252 15.011 4.292 15.258 4.392 15.466 4.486 15.673 4.626 15.767 4.692 15.868 4.819 15.988 4.852H16.128C16.342 4.899 16.583 4.866 16.783 4.925 17.138 5.039 17.458 5.205 17.745 5.385A5.953 5.953 0 0 1 19.83 7.671C19.91 7.825 19.945 7.966 20.018 8.126 20.158 8.456 20.331 8.789 20.473 9.108 20.613 9.423 20.748 9.744 20.949 10.005 21.049 10.145 21.451 10.218 21.631 10.291 21.764 10.351 21.971 10.406 22.091 10.479 22.321 10.619 22.545 10.779 22.761 10.933 22.871 11.009 23.204 11.176 23.224 11.311Z';

/* kitty (logo oficial, simple-icons): cabeça do gato, pupilas e terminal separados */
const KITTY_HEAD =
  'M5.064 1.943C4.776 1.944 4.554 2.003 4.441 2.136 3.967 2.663 4.786 4.852 5.761 6.066Q5.686 6.363 5.651 6.671C4.441 5.719 2.805 5.291 1.398 5.776 3 5.983 4.384 6.486 5.641 7.333Q5.661 7.591 5.717 7.841C4.017 6.708 1.682 6.372 0 7.438 1.753 7.164 3.392 7.395 4.953 7.993 4.683 8.005 4.434 8.074 4.217 8.19 2.805 7.943 1.389 8.178 0.766 9.098A8 8 0 0 1 3.646 8.716Q3.599 8.786 3.561 8.862H3.481C2.768 8.862 2.162 9.388 2.162 10.048 2.162 10.971 3.112 11.475 3.982 11.158 4.51 11.923 5.644 11.976 6.066 11.158 6.699 11.131 7.726 11.024 7.886 10.048A1 1 0 0 0 7.896 9.864H11.193C11.063 9.6 11.246 9.442 12.038 9.442 12.828 9.469 12.988 9.6 12.884 9.864H16.114A0.6 0.6 0 0 0 16.116 10.048C16.274 11.024 17.302 11.131 17.935 11.158 18.357 11.976 19.491 11.923 20.019 11.158 20.889 11.475 21.839 10.971 21.839 10.048 21.839 9.388 20.889 8.862 20.521 8.862H20.441Q20.403 8.786 20.358 8.716A8 8 0 0 1 23.235 9.098C22.612 8.178 21.195 7.943 19.785 8.19A1.7 1.7 0 0 0 19.047 7.993C20.607 7.395 22.247 7.164 24 7.438 22.347 6.39 20.06 6.698 18.37 7.784Q18.42 7.535 18.44 7.28C19.675 6.465 21.035 5.98 22.602 5.776 21.222 5.299 19.622 5.702 18.42 6.616A5 5 0 0 0 18.314 6.066C19.237 4.852 20.029 2.636 19.554 2.136 19.08 1.635 16.916 2.242 15.598 3.059A7.9 7.9 0 0 0 12.011 2.216C10.666 2.216 9.426 2.532 8.397 3.059 7.408 2.446 5.93 1.936 5.063 1.942M9.533 5.722A1.7 1.7 0 0 1 11.22 7.41 1.7 1.7 0 0 1 9.532 9.097 1.7 1.7 0 0 1 7.842 7.41 1.7 1.7 0 0 1 9.532 5.722M14.489 5.722A1.7 1.7 0 0 1 16.177 7.41C16.177 8.333 15.439 9.097 14.489 9.097A1.7 1.7 0 0 1 12.802 7.41 1.7 1.7 0 0 1 14.489 5.722';
const KITTY_PUPILS = [
  'M9.53 6.776C9.335 6.776 9.18 7.146 9.18 7.62 9.18 8.095 9.335 8.464 9.53 8.464S9.88 8.094 9.88 7.62C9.88 7.145 9.724 6.776 9.53 6.776',
  'M14.432 6.776C14.237 6.776 14.082 7.146 14.082 7.62 14.082 8.095 14.237 8.464 14.432 8.464S14.782 8.094 14.782 7.62C14.782 7.145 14.626 6.776 14.432 6.776',
];
const KITTY_TERMINAL =
  'M8.323 10.365C8.156 10.89 7.753 11.248 7.35 11.42 6.962 11.586 6.6 11.6 6.287 11.62A2 2 0 0 1 5.887 11.987V21.329A0.73 0.73 0 0 0 6.617 22.058H17.384A0.73 0.73 0 0 0 18.114 21.329V11.987Q17.894 11.837 17.716 11.62C17.402 11.602 17.04 11.586 16.651 11.42A1.73 1.73 0 0 1 15.679 10.365ZM8.074 12.638A0.44 0.44 0 0 1 8.35 12.755L11.086 15.489A0.44 0.44 0 0 1 11.086 16.109L8.35 18.844C7.937 19.257 7.317 18.637 7.73 18.224L10.158 15.799 7.73 13.373A0.438 0.438 0 0 1 8.074 12.637M12.384 18.096H16.253C16.809 18.123 16.809 18.944 16.253 18.971H12.383C11.827 18.944 11.827 18.123 12.383 18.096';

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

/* Java: o Duke dá três pulinhos gingando como um pinguim, o nariz acende e ele pia */
function JavaArt({ icon }) {
  return (
    <Art className={styles.white}>
      <ellipse cx="12" cy="23.6" rx="7" ry="0.7" className={styles.dukeShadow} />
      <g className={styles.dukeHop}>
        <path d={icon.path} />
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

/* React: o átomo gira pra dentro, os anéis se ajeitam no lugar e o núcleo pulsa */
function ReactArt() {
  const rings = [0, 60, 120];
  return (
    <Art viewBox="-12 -12 24 24" className={styles.reactAtom}>
      {rings.map((angle, i) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <g className={styles.reactRing} style={{ '--i': i }}>
            <ellipse rx="11" ry="4.2" className={styles.reactOrbit} />
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

/* Vite: o raio cai do céu, clareia tudo, relampeja e solta faíscas */
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

/* Node.js: o hexágono se desenha e um ponto dá uma volta completa, como o event loop */
function NodeArt({ icon }) {
  return (
    <DrawArt
      icon={icon}
      extra={<circle cx="12" cy="12" r="13.5" pathLength="1" transform="rotate(-90 12 12)" className={styles.nodeLoop} />}
    />
  );
}

/* Express: entra a toda velocidade com linhas de vento */
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

/* PostgreSQL: o elefante balança a tromba, joga a cabeça pra trás e solta um grito (a tromba fica presa na base) */
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
          d={`M${21.2 + i * 1.4} ${18.4 - i * 1.1}q${1.3 + i * 0.4} ${2 + i * 1.1} 0 ${4 + i * 2.2}`}
          className={styles.roar}
          style={{ '--i': i }}
        />
      ))}
    </Art>
  );
}

/* MySQL: o golfinho salta de trás do nome num arco e cai no lugar espirrando água */
function MySqlArt() {
  return (
    <Art className={styles.white}>
      <path d={MYSQL_TEXT} />
      <g className={styles.dolphin}>
        <path d={MYSQL_DOLPHIN} />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx="19.5" cy="11.6" r="0.45" className={styles.splash} style={{ '--i': i }} />
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

/* Docker: os containers são empilhados um a um e a baleia balança a nadadeira (presa pela base) */
function DockerArt({ icon }) {
  const id = useSafeId();
  const tail = [17.6, 5, 6.9, 6.4];
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
      <g className={styles.whaleBob}>
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

/* Excel: a planilha é preenchida célula por célula e o X acende */
function ExcelArt() {
  const id = useSafeId();
  const cells = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 4; c += 1) cells.push([c * 6, r * 6, r + c]);
  }
  return (
    <Art>
      <mask id={id} maskUnits="userSpaceOnUse" x="-1" y="-1" width="26" height="26">
        {cells.map(([x, y, i]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="6.05" height="6.05" fill="#fff" className={styles.xlCell} style={{ '--i': i }} />
        ))}
      </mask>
      <rect x="2" y="8" width="8" height="8.5" className={styles.xlGlow} />
      <path d={EXCEL_PATH} fill="#21A366" mask={`url(#${id})`} />
    </Art>
  );
}

/* GLPI: o G gira pra dentro e as letras L, P e I caem uma a uma */
function GlpiArt() {
  return (
    <Art viewBox="0 0 216 92" className={styles.wide}>
      <g className={styles.glpiG}>
        <path d={GLPI.g} fill="#00a5f3" />
        <path d={GLPI.gInner} fill="#80d2f8" />
      </g>
      <g className={styles.glpiTail}>
        {GLPI.tail.map((part) => (
          <path key={part.d} d={part.d} fill={part.fill} />
        ))}
      </g>
      {[GLPI.l, GLPI.p, GLPI.i].map((d, i) => (
        <g key={i} className={styles.glpiLetter} style={{ '--i': i }}>
          <path d={d} fill="#00a5f3" fillRule="evenodd" />
        </g>
      ))}
    </Art>
  );
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

/* Wiki.js: a borboleta em camadas chega voando e todas as camadas das asas batem juntas */
function WikiArt() {
  const id = useSafeId();
  const left = [-1, -1, 12.1, 26];
  const right = [12.4, -1, 12.6, 26];
  return (
    <Art>
      <defs>
        <ClipRest id={`${id}-rest`} rects={[left, right]} />
        <ClipRect id={`${id}-l`} rect={left} />
        <ClipRect id={`${id}-r`} rect={right} />
      </defs>
      <g className={styles.flyIn}>
        <g className={styles.flutter}>
          {WIKI_WINGS.map((wing) => (
            <g key={wing.d} className={wing.side === 'l' ? styles.wingL : styles.wingR}>
              <path d={wing.d} className={styles.wikiWing} fillOpacity={wing.opacity} />
            </g>
          ))}
          <g className={styles.wingL}>
            <path d={WIKI_FRONT} className={styles.wikiWing} clipPath={`url(#${id}-l)`} />
          </g>
          <g className={styles.wingR}>
            <path d={WIKI_FRONT} className={styles.wikiWing} clipPath={`url(#${id}-r)`} />
          </g>
          <path d={WIKI_FRONT} className={styles.wikiWing} clipPath={`url(#${id}-rest)`} />
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

/* Zabbix: o quadrado acende, um batimento cruza a tela e vira o Z */
function ZabbixArt() {
  return (
    <Art>
      <rect width="24" height="24" rx="2" fill="#d40000" className={styles.zbxSquare} />
      <path d="M2 12.5h5l1.5-4.5 2.5 9.5 2-7.5 1.3 2.5H22" pathLength="1" className={styles.zbxPulse} />
      <g className={styles.zbxZ}>
        <g transform="translate(2.53 1.23) scale(0.16)">
          <path d={ZABBIX_Z} fill="#fff" />
        </g>
      </g>
    </Art>
  );
}

/* Grafana: gira como uma engrenagem e as métricas oscilam ao lado */
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

/* Azure: uma nuvem atravessa o card e deixa o A para trás */
function AzureArt() {
  const id = useSafeId();
  return (
    <Art>
      <clipPath id={id}>
        <rect x="-1" y="-1" width="26" height="26" className={styles.azReveal} />
      </clipPath>
      <path d={AZURE_PATH} fill="#0089D6" clipPath={`url(#${id})`} />
      <path
        d="M4 14.5a3 3 0 0 1 .6-5.9 4.2 4.2 0 0 1 8-1 3.4 3.4 0 0 1 4.6 3.2 2.4 2.4 0 0 1-.2 3.7Z"
        className={styles.cloud}
      />
    </Art>
  );
}

/* Claude Code: o bichinho entra andando de lado com as perninhas, levanta os braços e pisca */
function ClaudeCodeArt({ icon }) {
  const id = useSafeId();
  const legs = [4.45, 7.45, 14.95, 17.95].map((x) => [x, 16.45, 1.6, 3.2]);
  const armL = [-0.2, 10.45, 3.2, 3.1];
  const armR = [21, 10.45, 3.2, 3.1];
  return (
    <Art style={{ color: `#${icon.hex}` }}>
      <defs>
        <ClipRest id={`${id}-rest`} rects={[...legs, armL, armR]} />
        {legs.map((r, i) => (
          <ClipRect key={i} id={`${id}-leg${i}`} rect={r} />
        ))}
        <ClipRect id={`${id}-al`} rect={armL} />
        <ClipRect id={`${id}-ar`} rect={armR} />
      </defs>
      <g className={styles.clawdWalk}>
        <g className={styles.clawdHop}>
          <path d={icon.path} fill="currentColor" clipPath={`url(#${id}-rest)`} />
          {legs.map(([x], i) => (
            <g key={i} className={i % 2 ? styles.clawdLegB : styles.clawdLegA} style={{ transformOrigin: `${x + 0.8}px 16.45px` }}>
              <path d={icon.path} fill="currentColor" clipPath={`url(#${id}-leg${i})`} />
            </g>
          ))}
          <g className={styles.clawdArmL}>
            <path d={icon.path} fill="currentColor" clipPath={`url(#${id}-al)`} />
          </g>
          <g className={styles.clawdArmR}>
            <path d={icon.path} fill="currentColor" clipPath={`url(#${id}-ar)`} />
          </g>
          <rect x="5.95" y="7.45" width="1.6" height="3.1" fill="currentColor" className={styles.clawdLid} />
          <rect x="16.45" y="7.45" width="1.6" height="3.1" fill="currentColor" className={styles.clawdLid} />
        </g>
      </g>
    </Art>
  );
}

/* kitty: o terminal aparece, o gato sobe espiando por trás, olha pros lados, pisca e o cursor pisca */
function KittyArt() {
  const id = useSafeId();
  return (
    <Art className={styles.white}>
      <clipPath id={id}>
        <rect x="-2" y="-2" width="28" height="13.3" />
      </clipPath>
      <g className={styles.kittyTerm}>
        <path d={KITTY_TERMINAL} fillRule="evenodd" />
        <rect x="11.9" y="17.9" width="4.5" height="1.3" className={styles.kittyCursor} />
      </g>
      <g clipPath={`url(#${id})`}>
        <g className={styles.kittyHead}>
          <path d={KITTY_HEAD} fillRule="evenodd" />
          <g className={styles.kittyLook}>
            {KITTY_PUPILS.map((d) => (
              <path key={d} d={d} className={styles.kittyPupil} />
            ))}
          </g>
        </g>
      </g>
    </Art>
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
  'Claude Code': { Component: ClaudeCodeArt },
  kitty: { Component: KittyArt },
};


export default function SkillArt({ skill }) {
  const entry = ART[skill.name];
  if (entry) return <entry.Component icon={skill.icon} />;
  if (skill.icon) return <DrawArt icon={skill.icon} />;
  return <Mono text={skill.monogram} />;
}
