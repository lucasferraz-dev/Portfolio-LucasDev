import { useEffect, useRef, useState } from 'react';
import styles from './TuxWalker.module.css';
import { useLanguage } from '../../i18n/useLanguage';
import TuxSprite from './TuxSprite';

const SPEED = 32; // pixels por segundo andando
const LEAP_MS = 900;
const TURN_PAUSE = 450; // paradinha para virar quando o próximo destino é para o outro lado
const REST_MIN = 500; // tempo parado ao chegar num destino (sorteado entre os dois)
const REST_MAX = 3200;
const MIN_TRIP = 40; // distância mínima até o próximo destino
const TALK_MS = 3200;

/*
 * Tux que pula do card do Linux. Quando a animação do card termina (o Tux sai
 * pelo topo), este Tux continua o pulo num arco até em cima da primeira fileira
 * de ferramentas e fica passeando por ela: sorteia um destino, anda até lá, para
 * um tempo e escolhe outro, virando quando muda de direção. Ao clicar, ele para,
 * dá um pulinho e fala alguma coisa olhando para quem clicou.
 */
export default function TuxWalker({ containerRef }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const state = useRef({ x: 0, dir: 1, target: null, pauseUntil: 0, talkingUntil: 0 });
  const lastLine = useRef(-1);
  const [phase, setPhase] = useState('hidden'); // hidden → leap → walk
  const [line, setLine] = useState(null);
  const [talks, setTalks] = useState(0);
  const [walking, setWalking] = useState(false);
  const walkingRef = useRef(false);

  // posições, nas coordenadas da área das skills: de onde ele pula e por onde anda
  const measure = () => {
    const container = containerRef.current;
    const box = container.getBoundingClientRect();
    const rel = (el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left - box.left, right: r.right - box.left, top: r.top - box.top, width: r.width };
    };
    const linux = rel(container.querySelector('[data-skill="Linux"]'));
    // a primeira fileira inteira de ferramentas (os cards com o mesmo topo do primeiro)
    const all = [...container.querySelector('[data-skill="Git"]').parentElement.children].map(rel);
    const tools = all.filter((card) => Math.abs(card.top - all[0].top) < 2);
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
      const walking = !still && s.target !== null && now >= s.pauseUntil && now >= s.talkingUntil;

      // escolhe um destino aleatório na fileira; se for para o outro lado, vira antes
      if (!still && s.target === null && now >= s.pauseUntil) {
        let target = s.x;
        for (let tries = 0; tries < 8 && Math.abs(target - s.x) < MIN_TRIP; tries++) {
          target = minX + Math.random() * (maxX - minX);
        }
        s.target = target;
        const dir = Math.sign(target - s.x) || s.dir;
        if (dir !== s.dir) {
          s.dir = dir;
          s.pauseUntil = now + TURN_PAUSE;
        }
      }

      if (walking && s.target !== null) {
        s.x += s.dir * SPEED * dt;
        const arrived = s.dir > 0 ? s.x >= s.target : s.x <= s.target;
        if (arrived || s.x >= maxX || s.x <= minX) {
          s.x = Math.min(Math.max(arrived ? s.target : s.x, minX), maxX);
          s.target = null;
          s.pauseUntil = now + REST_MIN + Math.random() * (REST_MAX - REST_MIN);
        }
      }

      el.style.transform = `translate(${s.x}px, ${floor}px)`;
      // vira estilo Paper Mario: o CSS anima a escala de 1 para -1, achatando no meio
      el.style.setProperty('--face', s.dir);
      if (walkingRef.current !== walking) {
        walkingRef.current = walking;
        setWalking(walking);
      }
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
        <span key={talks} className={`${styles.hopper} ${talks ? styles.hop : ''}`}>
          <span className={styles.flip}>
            <TuxSprite mode={walking ? 'walk' : 'idle'} front={line !== null} />
          </span>
        </span>
      </button>
    </div>
  );
}
