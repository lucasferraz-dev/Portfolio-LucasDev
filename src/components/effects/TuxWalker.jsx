import { useEffect, useRef, useState } from 'react';
import styles from './TuxWalker.module.css';
import { useLanguage } from '../../i18n/useLanguage';

const SPEED = 32; // pixels por segundo andando
const LEAP_MS = 900;
const TURN_PAUSE = 700; // paradinha antes de virar para o outro lado
const TALK_MS = 3200;
const PATROL_CARDS = 3; // anda em cima dos primeiros cards de ferramentas

/*
 * Tux que pula do card do Linux. Quando a animação do card termina (o Tux sai
 * pelo topo), este Tux continua o pulo num arco até em cima da primeira fileira
 * de ferramentas e fica andando reto, indo e voltando por cima dos primeiros
 * cards. Ao clicar, ele para, dá um pulinho e fala alguma coisa.
 */
export default function TuxWalker({ containerRef }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const state = useRef({ x: 0, dir: 1, pauseUntil: 0, talkingUntil: 0 });
  const lastLine = useRef(-1);
  const [phase, setPhase] = useState('hidden'); // hidden → leap → walk
  const [line, setLine] = useState(null);
  const [talks, setTalks] = useState(0);

  // posições, nas coordenadas da área das skills: de onde ele pula e por onde anda
  const measure = () => {
    const container = containerRef.current;
    const box = container.getBoundingClientRect();
    const rel = (el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left - box.left, right: r.right - box.left, top: r.top - box.top, width: r.width };
    };
    const linux = rel(container.querySelector('[data-skill="Linux"]'));
    const tools = [...container.querySelector('[data-skill="Git"]').parentElement.children].slice(0, PATROL_CARDS).map(rel);
    return {
      from: { x: linux.left + linux.width / 2, y: linux.top },
      floor: tools[0].top,
      minX: tools[0].left + 18,
      maxX: tools[tools.length - 1].right - 18,
    };
  };

  // começa quando o Tux do card termina de pular para fora
  useEffect(() => {
    const card = containerRef.current?.querySelector('[data-skill="Linux"]');
    if (!card) return undefined;
    const onEnd = (event) => {
      if (event.animationName.includes('linuxJump')) setPhase((current) => (current === 'hidden' ? 'leap' : current));
    };
    card.addEventListener('animationend', onEnd);
    return () => card.removeEventListener('animationend', onEnd);
  }, [containerRef]);

  // o pulo: um arco do topo do card do Linux até em cima dos primeiros cards
  useEffect(() => {
    if (phase !== 'leap') return undefined;
    const { from, floor, minX } = measure();
    const to = { x: minX + 30, y: floor };
    const peak = Math.min(from.y, to.y) - 80;
    const frames = Array.from({ length: 13 }, (_, i) => {
      const k = i / 12;
      const x = from.x + (to.x - from.x) * k;
      // parábola passando por from, peak e to
      const y = (1 - k) * (1 - k) * from.y + 2 * (1 - k) * k * (2 * peak - (from.y + to.y) / 2) + k * k * to.y;
      return { transform: `translate(${x}px, ${y}px)` };
    });
    const animation = ref.current.animate(frames, { duration: LEAP_MS, easing: 'linear', fill: 'forwards' });
    state.current.x = to.x;
    state.current.dir = 1;
    animation.onfinish = () => setPhase('walk');
    return () => animation.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // andando: vai e volta em cima dos cards, com uma paradinha para virar
  useEffect(() => {
    if (phase !== 'walk') return undefined;
    const el = ref.current;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let last = performance.now();

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      const s = state.current;
      const { floor, minX, maxX } = measure();
      const walking = !still && now >= s.pauseUntil && now >= s.talkingUntil;

      if (walking) {
        s.x += s.dir * SPEED * dt;
        if (s.x >= maxX || s.x <= minX) {
          s.x = Math.min(Math.max(s.x, minX), maxX);
          s.dir *= -1;
          s.pauseUntil = now + TURN_PAUSE;
        }
      }

      el.style.transform = `translate(${s.x}px, ${floor}px)`;
      el.style.setProperty('--face', s.dir);
      el.classList.toggle(styles.walking, walking);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (line === null) return undefined;
    const timer = setTimeout(() => setLine(null), TALK_MS);
    return () => clearTimeout(timer);
  }, [line, talks]);

  const talk = () => {
    const lines = t.fun.tuxLines;
    let index = Math.floor(Math.random() * lines.length);
    if (index === lastLine.current) index = (index + 1) % lines.length;
    lastLine.current = index;
    state.current.talkingUntil = performance.now() + TALK_MS;
    setLine(lines[index]);
    setTalks((n) => n + 1);
  };

  if (phase === 'hidden') return null;

  return (
    <div ref={ref} className={`${styles.walker} ${phase === 'leap' ? styles.leaping : ''}`}>
      {line !== null && (
        <span key={talks} className={styles.bubble} role="status">
          {line}
        </span>
      )}
      <button
        type="button"
        className={styles.button}
        onClick={talk}
        disabled={phase !== 'walk'}
        aria-label={t.fun.tuxLabel}
        title={t.fun.tuxLabel}
      >
        <svg key={talks} viewBox="0 0 64 72" className={`${styles.tux} ${talks ? styles.hop : ''}`} aria-hidden="true">
          <path className={`${styles.orange} ${styles.footLeft}`} d="M18 62c-4 0-7 2-7 5 0 2 2 3 4 3h9c2 0 3-2 2-4l-2-3c-1-1-3-1-6-1z" />
          <path className={`${styles.orange} ${styles.footRight}`} d="M46 62c4 0 7 2 7 5 0 2-2 3-4 3h-9c-2 0-3-2-2-4l2-3c1-1 3-1 6-1z" />
          <path className={styles.black} d="M32 4C21 4 15 13 15 24c0 6-4 10-5 17-1 9 4 21 22 21s23-12 22-21c-1-7-5-11-5-17C49 13 43 4 32 4z" />
          <path className={styles.white} d="M32 24c-8 0-12 8-12 16 0 9 5 17 12 17s12-8 12-17c0-8-4-16-12-16z" />
          <ellipse className={styles.white} cx="26.5" cy="17" rx="4.5" ry="5.5" />
          <ellipse className={styles.white} cx="37.5" cy="17" rx="4.5" ry="5.5" />
          <circle className={styles.black} cx="29" cy="18" r="2.2" />
          <circle className={styles.black} cx="39" cy="18" r="2.2" />
          <path className={styles.orange} d="M27 24c2-2 4-3 7-3s5 1 7 3c-2 3-4 4-7 4s-5-1-7-4z" />
        </svg>
      </button>
    </div>
  );
}
