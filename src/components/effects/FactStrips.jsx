import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './FactStrips.module.css';
import { useLanguage } from '../../i18n/useLanguage';

/*
 * Onde cada fita começa: no espaço vazio do topo de uma seção, de um lado ou do
 * outro, levemente torta. null é o topo da página.
 */
const ANCHORS = [
  { section: null, side: 'left', top: 118, tilt: -3 },
  { section: 'about', side: 'right', top: 40, tilt: 3 },
  { section: 'projects', side: 'left', top: 40, tilt: -2 },
  { section: 'skills', side: 'right', top: 40, tilt: 4 },
  { section: 'journey', side: 'left', top: 40, tilt: -4 },
  { section: 'contact', side: 'right', top: 40, tilt: 2 },
];

const STORAGE_KEY = 'fact-strips';
const FRICTION = 0.9;

function loadOffsets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveOffsets(offsets) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offsets));
  } catch {}
}

/*
 * Uma fita arrastável. Durante o arrasto ela segue o ponteiro e inclina na
 * direção do movimento; ao soltar, desliza um pouco com a velocidade do gesto
 * e para. Dois cliques devolvem a fita para o lugar original.
 */
function Strip({ text, anchor, position, offset, onMove, index }) {
  const ref = useRef(null);
  const drag = useRef(null);
  const current = useRef(offset);
  const glide = useRef(0);

  const apply = (x, y, tilt = 0, lifted = false) => {
    current.current = { x, y };
    const el = ref.current;
    el.style.setProperty('--dx', `${x}px`);
    el.style.setProperty('--dy', `${y}px`);
    el.style.setProperty('--lean', `${tilt}deg`);
    el.classList.toggle(styles.lifted, lifted);
  };

  useLayoutEffect(() => {
    apply(offset.x, offset.y);
  }, [offset.x, offset.y]);

  useEffect(() => () => cancelAnimationFrame(glide.current), []);

  const onPointerDown = (event) => {
    cancelAnimationFrame(glide.current);
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      startX: event.clientX - current.current.x,
      startY: event.clientY - current.current.y,
      lastX: event.clientX,
      lastY: event.clientY,
      lastT: performance.now(),
      vx: 0,
      vy: 0,
    };
    apply(current.current.x, current.current.y, 0, true);
  };

  const onPointerMove = (event) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const dt = Math.max(now - d.lastT, 1);
    d.vx = (event.clientX - d.lastX) / dt;
    d.vy = (event.clientY - d.lastY) / dt;
    d.lastX = event.clientX;
    d.lastY = event.clientY;
    d.lastT = now;
    apply(event.clientX - d.startX, event.clientY - d.startY, Math.max(Math.min(d.vx * 12, 14), -14), true);
  };

  const onPointerUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    let vx = d.vx * 16;
    let vy = d.vy * 16;

    // desliza com a velocidade do gesto até parar
    const step = () => {
      vx *= FRICTION;
      vy *= FRICTION;
      const { x, y } = current.current;
      if (Math.abs(vx) < 0.3 && Math.abs(vy) < 0.3) {
        apply(x, y);
        onMove(index, current.current);
        return;
      }
      apply(x + vx, y + vy, Math.max(Math.min(vx * 0.8, 10), -10));
      glide.current = requestAnimationFrame(step);
    };
    step();
  };

  const reset = () => {
    cancelAnimationFrame(glide.current);
    ref.current.classList.add(styles.returning);
    apply(0, 0);
    onMove(index, { x: 0, y: 0 });
    setTimeout(() => ref.current?.classList.remove(styles.returning), 500);
  };

  return (
    <div
      ref={ref}
      className={styles.strip}
      style={{ ...position, '--tilt': `${anchor.tilt}deg`, '--i': index }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={reset}
      data-tour={index === 0 ? 'strip' : undefined}
    >
      <span className={styles.grip} aria-hidden="true" />
      <span className={styles.slashes}>//</span>
      <span className={styles.text}>{text}</span>
    </div>
  );
}

/*
 * Fitas com curiosidades sobre mim espalhadas pelo site, que dá para arrastar
 * e deixar onde quiser. A posição fica salva no navegador de quem visita.
 */
export default function FactStrips() {
  const { t } = useLanguage();
  const [positions, setPositions] = useState([]);
  const [offsets, setOffsets] = useState(loadOffsets);
  const layerRef = useRef(null);

  useEffect(() => {
    const measure = () => {
      const width = layerRef.current?.offsetWidth ?? window.innerWidth;
      const gutter = Math.max(width * 0.03, 12);
      setPositions(
        ANCHORS.map((anchor) => {
          const el = anchor.section && document.getElementById(anchor.section);
          const top = (el ? el.offsetTop : 0) + anchor.top;
          return anchor.side === 'left' ? { top, left: gutter } : { top, right: gutter };
        })
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.getElementById('main'));
    return () => observer.disconnect();
  }, []);

  const handleMove = (index, offset) => {
    setOffsets((previous) => {
      const next = { ...previous, [index]: offset };
      saveOffsets(next);
      return next;
    });
  };

  if (!positions.length) return <div ref={layerRef} className={styles.layer} aria-hidden="true" />;

  return (
    <div ref={layerRef} className={styles.layer}>
      {t.fun.strips.map((text, i) => (
        <Strip
          key={i}
          index={i}
          text={text}
          anchor={ANCHORS[i]}
          position={positions[i]}
          offset={offsets[i] ?? { x: 0, y: 0 }}
          onMove={handleMove}
        />
      ))}
    </div>
  );
}
