import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { siDocker, siGithub, siMysql, siPostgresql, siWikidotjs } from 'simple-icons';
import styles from './Critters.module.css';

/*
 * Easter egg: cópias dos mascotes que são bichos (das skills) passeando pelo site.
 * A baleia do Docker atravessa a tela nadando, a borboleta do Wiki.js voa e às
 * vezes pousa em cima de um card, o Octocat do GitHub fica pendurado num card
 * dos projetos, o elefante do PostgreSQL anda em cima dos cards do Como eu
 * trabalho e o golfinho do MySQL salta pela linha da Trajetória.
 * Não aparecem no celular nem para quem prefere menos movimento.
 */

const rand = (min, max) => min + Math.random() * (max - min);

function Icon({ icon, className, viewBox = '0 0 24 24', color }) {
  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true">
      <path d={icon.path} fill={color ?? `#${icon.hex}`} />
    </svg>
  );
}

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

/* ---------- Baleia do Docker: atravessa a tela de vez em quando, soltando esguicho ---------- */

function Whale() {
  const ref = useRef(null);
  const [run, setRun] = useState(null);

  useEffect(() => {
    let timer = setTimeout(() => setRun({ id: 0 }), rand(6000, 12000));
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!run) return undefined;
    const el = ref.current;
    const toRight = Math.random() < 0.5;
    const width = window.innerWidth;
    const from = toRight ? -140 : width + 40;
    const to = toRight ? width + 40 : -140;
    el.style.top = `${rand(18, 72)}vh`;
    // o logo da baleia olha para a esquerda; indo para a direita, espelha
    el.style.setProperty('--face', toRight ? -1 : 1);
    const swim = el.animate(
      [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }],
      { duration: rand(18000, 26000), easing: 'linear' }
    );
    let timer = 0;
    swim.onfinish = () => {
      timer = setTimeout(() => setRun((current) => ({ id: current.id + 1 })), rand(12000, 26000));
    };
    return () => {
      swim.cancel();
      clearTimeout(timer);
    };
  }, [run]);

  return (
    <div ref={ref} className={styles.whale} style={{ visibility: run ? 'visible' : 'hidden' }}>
      <div className={styles.whaleBob}>
        <span className={styles.spout} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <Icon icon={siDocker} className={styles.whaleIcon} />
      </div>
    </div>
  );
}

/* ---------- Borboleta do Wiki.js: voa pela tela e às vezes pousa em cima de um card ---------- */

function Butterfly() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const s = {
      x: rand(100, window.innerWidth - 100),
      y: rand(120, window.innerHeight - 100),
      vx: 0,
      vy: 0,
      target: null,
      perch: null, // card em que está pousada
      restUntil: 0,
      t: 0,
    };
    let frame = 0;
    let last = performance.now();

    const pickTarget = () => {
      // às vezes escolhe pousar em cima de um card que esteja na tela
      if (Math.random() < 0.3) {
        const cards = [...document.querySelectorAll('[data-sticky]')].filter((card) => {
          const r = card.getBoundingClientRect();
          return r.top > 80 && r.top < window.innerHeight - 40 && r.width > 0;
        });
        if (cards.length) {
          const card = cards[Math.floor(Math.random() * cards.length)];
          const offset = rand(0.2, 0.8);
          s.target = { card, offset };
          return;
        }
      }
      s.target = { x: rand(60, window.innerWidth - 60), y: rand(110, window.innerHeight - 80) };
    };

    const targetPoint = () => {
      if (!s.target.card) return s.target;
      const r = s.target.card.getBoundingClientRect();
      return { x: r.left + r.width * s.target.offset, y: r.top - 8 };
    };

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      s.t += dt;

      if (s.perch) {
        // pousada: acompanha o card até a hora de voar de novo
        const r = s.perch.card.getBoundingClientRect();
        s.x = r.left + r.width * s.perch.offset;
        s.y = r.top - 8;
        if (now >= s.restUntil || r.bottom < 0 || r.top > window.innerHeight) {
          s.perch = null;
          s.vy = -2;
          pickTarget();
        }
      } else {
        if (!s.target) pickTarget();
        const p = targetPoint();
        const dx = p.x - s.x;
        const dy = p.y - s.y;
        const dist = Math.hypot(dx, dy);
        // vai na direção do alvo com um voo meio zigue-zague, de borboleta
        s.vx += (dx / (dist || 1)) * 0.08 * dt + Math.sin(s.t * 0.21) * 0.05;
        s.vy += (dy / (dist || 1)) * 0.08 * dt + Math.cos(s.t * 0.17) * 0.07;
        const speed = Math.hypot(s.vx, s.vy);
        const max = 2.3;
        if (speed > max) {
          s.vx = (s.vx / speed) * max;
          s.vy = (s.vy / speed) * max;
        }
        s.x += s.vx * dt;
        s.y += s.vy * dt + Math.sin(s.t * 0.35) * 0.6;

        if (dist < 14) {
          if (s.target.card) {
            s.perch = s.target;
            s.restUntil = now + rand(2500, 5000);
            s.vx = 0;
            s.vy = 0;
          }
          s.target = null;
        }
      }

      el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.perch ? 0 : s.vx * 9}deg)`;
      el.classList.toggle(styles.resting, Boolean(s.perch));
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={ref} className={styles.butterfly}>
      <span className={styles.wings}>
        <Icon icon={siWikidotjs} className={styles.butterflyIcon} />
      </span>
    </div>
  );
}

/* ---------- Octocat do GitHub: pendurado num card dos projetos, balançando ---------- */

function Octocat() {
  const card = useTarget('[data-sticky="project-ROW_03"]');
  const [flips, setFlips] = useState(0);
  if (!card) return null;

  return createPortal(
    <div className={styles.octocatHook}>
      <span className={styles.thread} aria-hidden="true" />
      <button
        type="button"
        className={styles.octocat}
        onClick={() => setFlips((n) => n + 1)}
        aria-label="Octocat"
        title="Octocat"
      >
        <span key={flips} className={flips ? styles.somersault : ''}>
          <Icon icon={siGithub} className={styles.octocatIcon} color="var(--color-white)" />
        </span>
      </button>
    </div>,
    card
  );
}

/* ---------- Elefante do PostgreSQL: anda em cima dos cards do Como eu trabalho ---------- */

function Elephant() {
  const grid = useTarget('ol[class*="valuesGrid"]');
  const ref = useRef(null);
  const [trumpet, setTrumpet] = useState(0);

  useEffect(() => {
    if (!grid) return undefined;
    const el = ref.current;
    const s = { x: 40, dir: 1, target: null, pauseUntil: 0 };
    let frame = 0;
    let last = performance.now();
    let trumpetTimer = setInterval(() => setTrumpet((n) => n + 1), 11000);

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      const min = 30;
      const max = grid.offsetWidth - 30;
      if (s.target === null && now >= s.pauseUntil) {
        s.target = rand(min, max);
        s.dir = Math.sign(s.target - s.x) || s.dir;
      }
      const walking = s.target !== null && now >= s.pauseUntil;
      if (walking) {
        s.x += s.dir * 24 * dt;
        if ((s.dir > 0 && s.x >= s.target) || (s.dir < 0 && s.x <= s.target)) {
          s.target = null;
          s.pauseUntil = now + rand(1200, 4000);
        }
      }
      el.style.transform = `translateX(${s.x}px)`;
      // o elefante do logo olha para a esquerda; indo para a direita, espelha
      el.style.setProperty('--face', s.dir > 0 ? -1 : 1);
      el.classList.toggle(styles.walking, walking);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(trumpetTimer);
    };
  }, [grid]);

  if (!grid) return null;

  return createPortal(
    <div ref={ref} className={styles.elephant}>
      <span className={styles.flip}>
        <span className={styles.elephantBody}>
          <Icon icon={siPostgresql} className={styles.elephantIcon} />
        </span>
        {trumpet > 0 && (
          <span key={trumpet} className={styles.notes} aria-hidden="true">
            <i>♪</i>
            <i>♫</i>
            <i>♪</i>
          </span>
        )}
      </span>
    </div>,
    grid
  );
}

/* ---------- Golfinho do MySQL: salta pela linha que separa a Trajetória ---------- */

function Dolphin() {
  const section = useTarget('#journey');
  const ref = useRef(null);
  const [jump, setJump] = useState(null);

  useEffect(() => {
    if (!section) return undefined;
    let timer = 0;
    const schedule = () => {
      timer = setTimeout(() => {
        setJump({ x: rand(0.2, 0.85) * section.offsetWidth, id: Math.random() });
        schedule();
      }, rand(7000, 13000));
    };
    schedule();
    return () => clearTimeout(timer);
  }, [section]);

  useEffect(() => {
    if (!jump) return undefined;
    const el = ref.current;
    // arco da direita para a esquerda (o golfinho do logo olha para a esquerda)
    const frames = Array.from({ length: 11 }, (_, i) => {
      const k = i / 10;
      const x = jump.x - 170 * k;
      const y = 70 - Math.sin(Math.PI * k) * 110;
      const angle = -35 + 80 * k;
      return { transform: `translate(${x}px, ${y}px) rotate(${angle}deg)` };
    });
    const animation = el.animate(frames, { duration: 1500, easing: 'ease-in-out' });
    return () => animation.cancel();
  }, [jump]);

  if (!section) return null;

  return createPortal(
    <div className={styles.dolphinWater}>
      <div ref={ref} className={styles.dolphin}>
        <Icon icon={siMysql} viewBox="16.5 2.5 7.5 9.5" className={styles.dolphinIcon} />
      </div>
      {jump && (
        <span key={jump.id} aria-hidden="true">
          <span className={styles.splash} style={{ left: jump.x + 10 }} />
          <span className={`${styles.splash} ${styles.splashLate}`} style={{ left: jump.x - 160 }} />
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
  if (!enabled) return null;

  return (
    <>
      <Whale />
      <Butterfly />
      <Octocat />
      <Elephant />
      <Dolphin />
    </>
  );
}
