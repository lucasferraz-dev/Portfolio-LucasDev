import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DockerWhale from './DockerWhale';
import styles from './Critters.module.css';
import { MYSQL_DOLPHIN, WIKI_FRONT, WIKI_WINGS } from '../sections/skillShapes';

/*
 * Easter egg: cópias dos mascotes que são bichos (das skills) espalhadas pelo
 * site. Eles moram em lugares da página (não ficam presos na tela):
 * a baleia do Docker atravessa o espaço entre duas seções nadando, a borboleta
 * do Wiki.js voa por uma região e pousa nos cards e o golfinho do MySQL salta
 * pela linha da Trajetória quando ela está na tela. (Os chaveiros de tecnologia
 * ficam nos próprios cards dos projetos, em Keychains.)
 * Não aparecem no celular nem para quem prefere menos movimento.
 */

const rand = (min, max) => min + Math.random() * (max - min);
const SECTIONS = ['about', 'projects', 'skills', 'journey', 'contact'];

/* espera o elemento-alvo existir na página (as seções podem montar depois) */
function useTarget(selector) {
  const [el, setEl] = useState(null);
  useEffect(() => {
    const find = () => setEl((current) => (current?.isConnected ? current : document.querySelector(selector)));
    find();
    const timer = setInterval(find, 1000);
    return () => clearInterval(timer);
  }, [selector]);
  return el;
}

/* posição de um elemento nas coordenadas do <main> (a página) */
function pagePos(el, main) {
  const r = el.getBoundingClientRect();
  const m = main.getBoundingClientRect();
  return { x: r.left - m.left, y: r.top - m.top, w: r.width, h: r.height };
}

/* ---------- Baleia do Docker: nada entre as seções (desenho e animação em DockerWhale) ---------- */

function Whale({ main }) {
  const ref = useRef(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current;
    // escolhe o espaço entre duas seções e atravessa a página de um lado ao outro
    const section = document.getElementById(SECTIONS[Math.floor(Math.random() * SECTIONS.length)]);
    if (!section) return undefined;
    const toRight = Math.random() < 0.5;
    const width = main.offsetWidth;
    const from = toRight ? -160 : width + 60;
    const to = toRight ? width + 60 : -160;
    el.style.top = `${pagePos(section, main).y + rand(8, 36)}px`;
    // o logo da baleia olha para a esquerda; indo para a direita, espelha
    el.style.setProperty('--face', toRight ? -1 : 1);

    let timer = 0;
    const swim = el.animate(
      [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }],
      { duration: rand(22000, 30000), easing: 'linear', delay: run === 0 ? rand(2000, 6000) : 0, fill: 'backwards' }
    );
    swim.onfinish = () => {
      timer = setTimeout(() => setRun((n) => n + 1), rand(6000, 14000));
    };
    return () => {
      swim.cancel();
      clearTimeout(timer);
    };
  }, [run, main]);

  return (
    <div ref={ref} className={styles.whale}>
      <div className={styles.whaleFace}>
        <div className={styles.whaleWave}>
          <span className={styles.bubbles} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <DockerWhale />
        </div>
      </div>
    </div>
  );
}

/* ---------- Borboleta do Wiki.js: voa por uma região do site e pousa nos cards ---------- */

function Butterfly({ main }) {
  const id = useId().replace(/:/g, '');
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const home = document.getElementById('about') ?? main;
    const start = pagePos(home, main);
    const s = {
      x: rand(80, main.offsetWidth - 80),
      y: start.y + rand(60, 300),
      vx: 0,
      vy: 0,
      target: null,
      perch: null,
      restUntil: 0,
      glideUntil: 0,
      t: 0,
    };
    let frame = 0;
    let last = performance.now();

    // próximo destino: perto de onde ela está (até uns 700px para cima ou para baixo)
    const pickTarget = () => {
      const cards = [...main.querySelectorAll('[data-sticky]')]
        .map((card) => ({ card, p: pagePos(card, main) }))
        .filter(({ p }) => p.w > 0 && Math.abs(p.y - s.y) < 700);
      if (cards.length && Math.random() < 0.4) {
        const { card } = cards[Math.floor(Math.random() * cards.length)];
        s.target = { card, offset: rand(0.15, 0.85) };
      } else {
        const y = Math.min(Math.max(s.y + rand(-500, 500), 80), main.offsetHeight - 80);
        s.target = { x: rand(60, main.offsetWidth - 60), y };
      }
    };

    const targetPoint = () => {
      if (!s.target.card) return s.target;
      const p = pagePos(s.target.card, main);
      return { x: p.x + p.w * s.target.offset, y: p.y - 6 };
    };

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      s.t += dt;
      let flapping = true;
      let gliding = false;

      if (s.perch) {
        // pousada: acompanha o card até a hora de voar de novo
        const p = pagePos(s.perch.card, main);
        s.x = p.x + p.w * s.perch.offset;
        s.y = p.y - 6;
        flapping = false;
        if (now >= s.restUntil) {
          s.perch = null;
          s.vy = -2.5;
          pickTarget();
        }
      } else {
        if (!s.target) pickTarget();
        const p = targetPoint();
        const dx = p.x - s.x;
        const dy = p.y - s.y;
        const dist = Math.hypot(dx, dy);

        // de vez em quando plana com as asas abertas, sem bater
        if (now >= s.glideUntil && Math.random() < 0.004) s.glideUntil = now + rand(700, 1600);
        gliding = now < s.glideUntil;

        const pull = gliding ? 0.03 : 0.07;
        s.vx += (dx / (dist || 1)) * pull * dt + Math.sin(s.t * 0.13) * 0.05;
        s.vy += (dy / (dist || 1)) * pull * dt + Math.cos(s.t * 0.11) * 0.05;
        const max = gliding ? 1.6 : 2.2;
        const speed = Math.hypot(s.vx, s.vy);
        if (speed > max) {
          s.vx = (s.vx / speed) * max;
          s.vy = (s.vy / speed) * max;
        }
        s.x += s.vx * dt;
        // cada batida de asa dá um impulsinho para cima; planando, desce devagar
        s.y += s.vy * dt + (gliding ? 0.25 : Math.sin(s.t * 0.55) * 0.9);

        if (dist < 12) {
          if (s.target.card) {
            s.perch = s.target;
            s.restUntil = now + rand(2500, 6000);
            s.vx = 0;
            s.vy = 0;
          }
          s.target = null;
        }
      }

      el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.perch ? 0 : s.vx * 10}deg)`;
      el.classList.toggle(styles.resting, !flapping);
      el.classList.toggle(styles.gliding, gliding);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [main]);

  // cada lado da borboleta: as camadas de asa daquele lado e a metade da frente
  const half = (side) => (
    <g className={side === 'l' ? styles.wingLeft : styles.wingRight}>
      {WIKI_WINGS.filter((wing) => wing.side === side).map((wing) => (
        <path key={wing.d} d={wing.d} fillOpacity={wing.opacity} />
      ))}
      <path d={WIKI_FRONT} clipPath={`url(#${id}-${side})`} />
    </g>
  );

  return (
    <div ref={ref} className={styles.butterfly}>
      <svg viewBox="0 0 24 24" className={styles.butterflyIcon} aria-hidden="true">
        <defs>
          <clipPath id={`${id}-l`}>
            <rect x="-1" y="-1" width="13.25" height="26" />
          </clipPath>
          <clipPath id={`${id}-r`}>
            <rect x="12.25" y="-1" width="13" height="26" />
          </clipPath>
        </defs>
        {half('l')}
        {half('r')}
      </svg>
    </div>
  );
}

/* ---------- Golfinho do MySQL: salta pela linha da Trajetória quando ela está na tela ---------- */

function Dolphin() {
  const section = useTarget('#journey');
  const ref = useRef(null);
  const [jump, setJump] = useState(null);

  useEffect(() => {
    if (!section) return undefined;
    let timer = 0;
    let visible = false;
    const schedule = (delay) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!visible) return;
        setJump({ x: rand(0.3, 0.9) * section.offsetWidth, id: Math.random() });
        schedule(rand(4500, 7500));
      }, delay);
    };
    // só salta enquanto a linha de cima da Trajetória está na tela
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule(rand(600, 1400));
        else clearTimeout(timer);
      },
      { rootMargin: '-15% 0px -15% 0px' }
    );
    const probe = section.querySelector('[class*="dolphinWater"]') ?? section;
    observer.observe(probe);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [section]);

  useEffect(() => {
    if (!jump) return undefined;
    const el = ref.current;
    // arco da direita para a esquerda (o golfinho do logo olha para a esquerda)
    const frames = Array.from({ length: 13 }, (_, i) => {
      const k = i / 12;
      const x = jump.x - 260 * k;
      const y = 300 - Math.sin(Math.PI * k) * 280;
      const angle = -40 + 95 * k;
      return { transform: `translate(${x}px, ${y}px) rotate(${angle}deg)` };
    });
    const animation = el.animate(frames, { duration: 1700, easing: 'ease-in-out' });
    return () => animation.cancel();
  }, [jump]);

  if (!section) return null;

  return createPortal(
    <div className={styles.dolphinWater}>
      <div ref={ref} className={styles.dolphin}>
        <svg viewBox="15.4 2.6 9 10.6" aria-hidden="true">
          <path d={MYSQL_DOLPHIN} fill="var(--color-white)" />
        </svg>
      </div>
      {jump && (
        <span key={jump.id} aria-hidden="true">
          <span className={styles.splash} style={{ left: jump.x + 30 }} />
          <span className={`${styles.splash} ${styles.splashLate}`} style={{ left: jump.x - 230 }} />
        </span>
      )}
    </div>,
    section
  );
}

export default function Critters() {
  const [enabled] = useState(
    () =>
      window.matchMedia('(min-width: 768px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const main = useTarget('#main');
  if (!enabled || !main) return null;

  return (
    <>
      {createPortal(
        <div className={styles.layer} aria-hidden="true">
          <Whale main={main} />
          <Butterfly main={main} />
        </div>,
        main
      )}
      <Dolphin />
    </>
  );
}
