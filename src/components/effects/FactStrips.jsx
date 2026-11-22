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
 * Física de corpo rígido preso pelo ponto de pega:
 * o ponto onde a fita foi pega fica preso no cursor e ela gira em torno dele.
 * A aceleração do cursor joga o centro da fita para o lado (inércia), então
 * trancos fazem ela balançar e passar do ponto, e girar o mouse em círculos faz
 * ela girar como hélice. Um atrito leve alinha a fita atrás do movimento.
 * Pegando no meio não há alavanca, então ela só acompanha, sem girar. Ao
 * soltar, segue girando e deslizando com o embalo, e quica nas bordas da página.
 */
const INERTIA = 1.3; // quanto a aceleração do ponteiro joga a fita (balanço, hélice)
const DRAG = 0.15; // atrito leve que alinha a fita atrás do movimento
const SPIN_DAMPING = 0.06; // freio do giro enquanto o ponteiro se move rápido
const PLACING_DAMPING = 0.5; // freio extra quando o ponteiro está devagar (posicionando a fita)
const PLACING_SPEED = 7; // abaixo disso (px/quadro) é posicionar; acima, é girar ou arremessar
const THROW_SPEED = 7; // soltar abaixo dessa velocidade gruda na hora, sem deslizar
const MAX_SPIN = 0.45; // giro máximo por quadro (radianos)
const JITTER = 1.2; // trancos menores que isso (px/quadro²) são tremida da mão e não contam
const FRICTION = 0.94;
const SPIN_FRICTION = 0.965;
const BOUNCE = 0.5;

function Strip({ text, anchor, position, saved, onSettle, onGrab, index, showHint, hintText, layerRef }) {
  const ref = useRef(null);
  const body = useRef({ x: saved.x, y: saved.y, a: saved.a ?? 0, vx: 0, vy: 0, w: 0, baseX: 0, baseY: 0 });
  const drag = useRef(null);
  const frame = useRef(0);
  const last = useRef(0);
  // card em que a fita está colada (data-sticky) e a distância do centro dela ao centro dele
  const host = useRef(saved.host ? { id: saved.host, ox: saved.ox, oy: saved.oy } : null);
  const follow = useRef(0);
  const target = useRef(null);

  const apply = () => {
    const { x, y, a } = body.current;
    const el = ref.current;
    el.style.setProperty('--dx', `${x}px`);
    el.style.setProperty('--dy', `${y}px`);
    el.style.setProperty('--angle', `${a}deg`);
  };

  // centro da fita sem deslocamento, nas coordenadas da camada (= da página)
  const measureBase = () => {
    const el = ref.current;
    const layer = layerRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const b = body.current;
    b.baseX = rect.left + rect.width / 2 - layer.left - b.x;
    b.baseY = rect.top + rect.height / 2 - layer.top - b.y;
  };

  // mantém a fita inteira dentro da página; devolve em quais eixos bateu na borda
  const keepInside = () => {
    const b = body.current;
    const el = ref.current;
    const layer = layerRef.current;
    const rad = ((anchor.tilt + b.a) * Math.PI) / 180;
    const w = el.offsetWidth / 2;
    const h = el.offsetHeight / 2;
    const hx = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad));
    const hy = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
    const cx = b.baseX + b.x;
    const cy = b.baseY + b.y;
    const nx = Math.min(Math.max(cx, hx + 4), layer.offsetWidth - hx - 4);
    const ny = Math.min(Math.max(cy, hy + 4), layer.offsetHeight - hy - 4);
    b.x += nx - cx;
    b.y += ny - cy;
    return { hitX: nx !== cx, hitY: ny !== cy };
  };

  const stripCenter = () => {
    const r = ref.current.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2];
  };

  // card “colável” embaixo do centro da fita, se houver
  const findHost = () => {
    const [cx, cy] = stripCenter();
    for (const el of document.elementsFromPoint(cx, cy)) {
      if (ref.current.contains(el)) continue;
      const found = el.closest('[data-sticky]');
      if (found) return found;
    }
    return null;
  };

  // contorno no card enquanto a fita está sendo arrastada por cima dele
  const highlight = (el) => {
    if (target.current === el) return;
    target.current?.removeAttribute('data-sticker-target');
    el?.setAttribute('data-sticker-target', '');
    target.current = el;
  };

  // colada num card: a cada quadro a fita vai para onde o card estiver
  const startFollowing = () => {
    cancelAnimationFrame(follow.current);
    const tick = () => {
      follow.current = requestAnimationFrame(tick);
      const h = host.current;
      if (!h || drag.current) return;
      const card = document.querySelector(`[data-sticky="${CSS.escape(h.id)}"]`);
      const r = card?.getBoundingClientRect();
      if (!r || !r.width) return;
      const layer = layerRef.current.getBoundingClientRect();
      measureBase();
      const b = body.current;
      b.x = r.left + r.width / 2 - layer.left + h.ox - b.baseX;
      b.y = r.top + r.height / 2 - layer.top + h.oy - b.baseY;
      apply();
    };
    tick();
  };

  useLayoutEffect(() => {
    Object.assign(body.current, { x: saved.x, y: saved.y, a: saved.a ?? 0 });
    apply();
    // fitas que tinham ficado fora da página (de versões antigas) voltam para dentro
    measureBase();
    const { hitX, hitY } = keepInside();
    if (hitX || hitY) {
      apply();
      const { x, y, a } = body.current;
      onSettle(index, { x, y, a, ...(host.current && { host: host.current.id, ox: host.current.ox, oy: host.current.oy }) });
    }
    if (host.current) startFollowing();
    // só deve rodar quando a posição salva muda, não a cada render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved.x, saved.y, saved.a]);

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      cancelAnimationFrame(follow.current);
      target.current?.removeAttribute('data-sticker-target');
    },
    []
  );

  const settle = () => {
    const el = ref.current;
    el.classList.remove(styles.lifted, styles.stuck);
    void el.offsetWidth; // reinicia a animação de “colar”
    el.classList.add(styles.stuck);
    highlight(null);

    // se caiu em cima de um card, cola nele e passa a acompanhá-lo
    const card = findHost();
    if (card) {
      const r = card.getBoundingClientRect();
      const [cx, cy] = stripCenter();
      host.current = { id: card.dataset.sticky, ox: cx - (r.left + r.width / 2), oy: cy - (r.top + r.height / 2) };
      startFollowing();
    } else {
      host.current = null;
    }

    const { x, y, a } = body.current;
    onSettle(index, { x, y, a, ...(host.current && { host: host.current.id, ox: host.current.ox, oy: host.current.oy }) });
  };

  const loop = (now) => {
    const dt = Math.min((now - last.current) / 16.67, 3);
    last.current = now;
    const b = body.current;
    const d = drag.current;

    if (d) {
      // torque do atrito no centro em volta do ponto de pega (preso no cursor)
      const r2 = d.rx * d.rx + d.ry * d.ry;
      const inertia = r2 + d.i0;
      // devagar o giro freia forte (dá para posicionar); rápido, ele fica solto
      const speed = Math.hypot(d.vx, d.vy);
      const damping = SPIN_DAMPING + PLACING_DAMPING * Math.max(1 - speed / PLACING_SPEED, 0);
      const torque =
        -INERTIA * (d.rx * d.ay - d.ry * d.ax) - DRAG * (d.rx * d.vy - d.ry * d.vx) - damping * b.w * r2;
      b.w = Math.max(Math.min(b.w + (torque / inertia) * dt, MAX_SPIN), -MAX_SPIN);

      const turn = b.w * dt;
      const cos = Math.cos(turn);
      const sin = Math.sin(turn);
      const rx = d.rx * cos - d.ry * sin;
      d.ry = d.rx * sin + d.ry * cos;
      d.rx = rx;
      b.a += (turn * 180) / Math.PI;

      b.x = d.px + d.rx - b.baseX;
      b.y = d.py + d.ry - b.baseY;
      keepInside();
      highlight(findHost());
      // aceleração do ponteiro neste quadro; sem eventos novos, a velocidade some aos poucos
      d.ax = 0;
      d.ay = 0;
      d.vx *= 0.75;
      d.vy *= 0.75;
    } else {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.a += ((b.w * dt) * 180) / Math.PI;
      b.vx *= FRICTION;
      b.vy *= FRICTION;
      b.w *= SPIN_FRICTION;

      const { hitX, hitY } = keepInside();
      if (hitX) b.vx *= -BOUNCE;
      if (hitY) b.vy *= -BOUNCE;

      if (Math.abs(b.vx) < 0.12 && Math.abs(b.vy) < 0.12 && Math.abs(b.w) < 0.002) {
        apply();
        settle();
        return;
      }
    }

    apply();
    frame.current = requestAnimationFrame(loop);
  };

  const pointerInLayer = (event) => {
    const layer = layerRef.current.getBoundingClientRect();
    return [event.clientX - layer.left, event.clientY - layer.top];
  };

  const onPointerDown = (event) => {
    cancelAnimationFrame(frame.current);
    cancelAnimationFrame(follow.current);
    host.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    measureBase();
    const b = body.current;
    const [px, py] = pointerInLayer(event);
    const el = ref.current;
    drag.current = {
      px,
      py,
      rx: b.baseX + b.x - px,
      ry: b.baseY + b.y - py,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      moved: false,
      lastT: performance.now(),
      // momento de inércia da própria fita (retângulo girando no centro)
      i0: (el.offsetWidth ** 2 + el.offsetHeight ** 2) / 12,
    };
    b.w = 0;
    el.classList.remove(styles.stuck);
    el.classList.add(styles.lifted);
    onGrab();
    last.current = performance.now();
    frame.current = requestAnimationFrame(loop);
  };

  const onPointerMove = (event) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const [px, py] = pointerInLayer(event);
    const frames = Math.max((now - d.lastT) / 16.67, 0.5);
    const vx = d.vx * 0.4 + ((px - d.px) / frames) * 0.6;
    const vy = d.vy * 0.4 + ((py - d.py) / frames) * 0.6;
    // o primeiro movimento depois de segurar não conta como tranco, e tremidas pequenas são ignoradas
    const ax = vx - d.vx;
    const ay = vy - d.vy;
    if (d.moved && Math.hypot(ax, ay) > JITTER) {
      d.ax += ax;
      d.ay += ay;
    }
    d.moved = true;
    d.vx = vx;
    d.vy = vy;
    d.px = px;
    d.py = py;
    d.lastT = now;
  };

  const onPointerUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const b = body.current;
    const idle = performance.now() - d.lastT > 80;
    const vx = idle ? 0 : d.vx;
    const vy = idle ? 0 : d.vy;
    const cvx = vx - b.w * d.ry;
    const cvy = vy + b.w * d.rx;

    // soltou devagar: a pessoa só quer deixar a fita ali, então ela gruda na hora
    if (Math.hypot(cvx, cvy) < THROW_SPEED) {
      cancelAnimationFrame(frame.current);
      Object.assign(b, { vx: 0, vy: 0, w: 0 });
      apply();
      settle();
      return;
    }

    // arremesso de verdade: o centro sai com a velocidade do ponto de pega mais a do giro
    b.vx = cvx;
    b.vy = cvy;
  };

  const reset = () => {
    cancelAnimationFrame(frame.current);
    cancelAnimationFrame(follow.current);
    host.current = null;
    highlight(null);
    drag.current = null;
    const el = ref.current;
    el.classList.add(styles.returning);
    Object.assign(body.current, { x: 0, y: 0, a: 0, vx: 0, vy: 0, w: 0 });
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
 * Fitas com curiosidades sobre mim espalhadas pelo site (cada uma sorteia uma
 * entre algumas a cada visita), que dá para arrastar, girar e deixar onde quiser. Enquanto ninguém mexeu nelas, tremem de vez em
 * quando e a primeira mostra um “arraste-me”. Posição e ângulo ficam salvos no
 * navegador de quem visita; dois cliques devolvem a fita ao lugar.
 */
export default function FactStrips() {
  const { t } = useLanguage();
  const [positions, setPositions] = useState([]);
  const [offsets, setOffsets] = useState(() => load(STORAGE_KEY, {}));
  const [moved, setMoved] = useState(() => load(MOVED_KEY, false));
  // cada fita tem algumas curiosidades; a cada visita uma delas é sorteada
  const [picks] = useState(() => ANCHORS.map(() => Math.random()));
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
        t.fun.strips.map((options, i) => (
          <Strip
            key={i}
            index={i}
            text={options[Math.floor(picks[i] * options.length)]}
            layerRef={layerRef}
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
