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
const MOVED_KEY = 'fact-strips-moved';

// física: quanto o movimento gira a fita e quanto ela perde de velocidade por quadro
const TORQUE = 0.0022;
const SPIN_DAMPING_HELD = 0.9;
const SPIN_DAMPING_FREE = 0.95;
const FRICTION = 0.92;

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/*
 * Uma fita com física simples de corpo rígido. Segurando, ela acompanha o
 * ponteiro e gira em torno do ponto onde foi pega (o movimento do ponteiro em
 * relação ao centro vira torque). Ao soltar, continua deslizando e girando com
 * o embalo até parar, e então “cola” como um selo, guardando posição e ângulo.
 */
function Strip({ text, anchor, position, saved, onSettle, onGrab, index, showHint, hintText }) {
  const ref = useRef(null);
  const body = useRef({ x: saved.x, y: saved.y, a: saved.a ?? 0, vx: 0, vy: 0, va: 0 });
  const drag = useRef(null);
  const frame = useRef(0);
  const last = useRef(0);

  const apply = () => {
    const { x, y, a } = body.current;
    const el = ref.current;
    el.style.setProperty('--dx', `${x}px`);
    el.style.setProperty('--dy', `${y}px`);
    el.style.setProperty('--angle', `${a}deg`);
  };

  useLayoutEffect(() => {
    Object.assign(body.current, { x: saved.x, y: saved.y, a: saved.a ?? 0 });
    apply();
  }, [saved.x, saved.y, saved.a]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const settle = () => {
    const el = ref.current;
    el.classList.remove(styles.lifted);
    el.classList.remove(styles.stuck);
    void el.offsetWidth; // reinicia a animação de “colar”
    el.classList.add(styles.stuck);
    const { x, y, a } = body.current;
    onSettle(index, { x, y, a });
  };

  const loop = (now) => {
    const dt = Math.min((now - last.current) / 16.67, 3);
    last.current = now;
    const b = body.current;
    const held = Boolean(drag.current);

    b.a += b.va * dt;
    b.va *= held ? SPIN_DAMPING_HELD : SPIN_DAMPING_FREE;

    if (held) {
      // o ponto de pega gira junto com a fita
      const rad = (b.va * dt * Math.PI) / 180;
      const { rx, ry } = drag.current;
      drag.current.rx = rx * Math.cos(rad) - ry * Math.sin(rad);
      drag.current.ry = rx * Math.sin(rad) + ry * Math.cos(rad);
    } else {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.vx *= FRICTION;
      b.vy *= FRICTION;
      if (Math.abs(b.vx) < 0.15 && Math.abs(b.vy) < 0.15 && Math.abs(b.va) < 0.1) {
        apply();
        settle();
        return;
      }
    }

    apply();
    frame.current = requestAnimationFrame(loop);
  };

  const onPointerDown = (event) => {
    cancelAnimationFrame(frame.current);
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = ref.current.getBoundingClientRect();
    drag.current = {
      lastX: event.clientX,
      lastY: event.clientY,
      lastT: performance.now(),
      rx: event.clientX - (rect.left + rect.width / 2),
      ry: event.clientY - (rect.top + rect.height / 2),
      vx: 0,
      vy: 0,
    };
    ref.current.classList.remove(styles.stuck);
    ref.current.classList.add(styles.lifted);
    onGrab();
    last.current = performance.now();
    frame.current = requestAnimationFrame(loop);
  };

  const onPointerMove = (event) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const dx = event.clientX - d.lastX;
    const dy = event.clientY - d.lastY;
    const frames = Math.max((now - d.lastT) / 16.67, 0.25);
    const b = body.current;

    b.x += dx;
    b.y += dy;
    // movimento perpendicular ao braço (centro → ponto de pega) gira a fita
    b.va += (d.rx * dy - d.ry * dx) * TORQUE;
    d.vx = dx / frames;
    d.vy = dy / frames;
    d.lastX = event.clientX;
    d.lastY = event.clientY;
    d.lastT = now;
  };

  const onPointerUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    // se o ponteiro estava parado na hora de soltar, não arremessa
    const idle = performance.now() - d.lastT > 80;
    body.current.vx = idle ? 0 : d.vx;
    body.current.vy = idle ? 0 : d.vy;
  };

  const reset = () => {
    cancelAnimationFrame(frame.current);
    drag.current = null;
    const el = ref.current;
    el.classList.add(styles.returning);
    Object.assign(body.current, { x: 0, y: 0, a: 0, vx: 0, vy: 0, va: 0 });
    apply();
    onSettle(index, { x: 0, y: 0, a: 0 });
    setTimeout(() => el.classList.remove(styles.returning, styles.lifted), 500);
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
      <div className={styles.inner}>
        <div className={styles.face}>
          <span className={styles.grip} aria-hidden="true" />
          <span className={styles.slashes}>//</span>
          <span className={styles.text}>{text}</span>
        </div>
        <span className={styles.peel} aria-hidden="true" />
      </div>
      {showHint && (
        <span className={styles.hint} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.8-2.4L4 15.5a1.6 1.6 0 0 1 2.5-2L9 16" />
          </svg>
          {hintText}
        </span>
      )}
    </div>
  );
}

/*
 * Fitas com curiosidades sobre mim espalhadas pelo site, que dá para arrastar,
 * girar e deixar onde quiser. Enquanto ninguém mexeu nelas, tremem de vez em
 * quando e a primeira mostra um “arraste-me”. Posição e ângulo ficam salvos no
 * navegador de quem visita; dois cliques devolvem a fita ao lugar.
 */
export default function FactStrips() {
  const { t } = useLanguage();
  const [positions, setPositions] = useState([]);
  const [offsets, setOffsets] = useState(() => load(STORAGE_KEY, {}));
  const [moved, setMoved] = useState(() => load(MOVED_KEY, false));
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

  const handleSettle = (index, offset) => {
    setOffsets((previous) => {
      const next = { ...previous, [index]: offset };
      save(STORAGE_KEY, next);
      return next;
    });
  };

  const handleGrab = () => {
    if (moved) return;
    setMoved(true);
    save(MOVED_KEY, true);
  };

  return (
    <div ref={layerRef} className={`${styles.layer} ${moved ? '' : styles.invite}`}>
      {positions.length > 0 &&
        t.fun.strips.map((text, i) => (
          <Strip
            key={i}
            index={i}
            text={text}
            anchor={ANCHORS[i]}
            position={positions[i]}
            saved={offsets[i] ?? { x: 0, y: 0, a: 0 }}
            onSettle={handleSettle}
            onGrab={handleGrab}
            showHint={!moved && i === 0}
            hintText={t.fun.dragHint}
          />
        ))}
    </div>
  );
}
