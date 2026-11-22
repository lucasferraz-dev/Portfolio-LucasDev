import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { siClaudecode } from 'simple-icons';
import styles from './Critters.module.css';
import { KITTY_HEAD, KITTY_PUPILS, WIKI_FRONT, WIKI_WINGS } from '../sections/skillShapes';

/*
 * Easter egg: cópias dos mascotes que são bichos (das skills) espalhadas pelo
 * site. Eles moram em lugares da página (não ficam presos na tela): a borboleta
 * do Wiki.js voa por uma região e pousa nos cards, o bonequinho do Claude Code
 * anda em cima dos cards e pula de um para outro e o gato do kitty espia por
 * trás da borda dos cards. (Os chaveiros de tecnologia ficam nos próprios
 * cards dos projetos, em Keychains.)
 * Não aparecem no celular nem para quem prefere menos movimento.
 */

const rand = (min, max) => min + Math.random() * (max - min);

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

/* cards de um tamanho bom para andar ou espiar, na página toda */
function cardsIn(main, minWidth) {
  return [...main.querySelectorAll('[data-sticky]')]
    .map((card) => ({ card, p: pagePos(card, main) }))
    .filter(({ p }) => p.w >= minWidth);
}

/* ---------- Claude Code: o bonequinho anda em cima dos cards e pula de um para outro ---------- */

// pedaços do logo que se mexem sozinhos (x, y, largura, altura no viewBox 24)
const CLAWD_LEGS = [4.45, 7.45, 14.95, 17.95].map((x) => [x, 16.45, 1.6, 3.2]);
const CLAWD_ARM_L = [-0.2, 10.45, 3.2, 3.1];
const CLAWD_ARM_R = [21, 10.45, 3.2, 3.1];
const CLAWD_SPEED = 38;

function ClawdSprite({ id }) {
  const parts = [...CLAWD_LEGS, CLAWD_ARM_L, CLAWD_ARM_R];
  const holes = parts.map(([x, y, w, h]) => `M${x} ${y}h${w}v${h}h${-w}Z`).join('');
  const clip = (name, [x, y, w, h]) => (
    <clipPath id={`${id}-${name}`}>
      <rect x={x} y={y} width={w} height={h} />
    </clipPath>
  );
  const piece = (name, className, origin) => (
    <g className={className} style={origin && { transformOrigin: origin }}>
      <path d={siClaudecode.path} clipPath={`url(#${id}-${name})`} />
    </g>
  );

  return (
    <svg viewBox="-1 2 26 19" className={styles.clawdSvg} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-rest`}>
          <path clipRule="evenodd" d={`M-6 -6H30V30H-6Z${holes}`} />
        </clipPath>
        {CLAWD_LEGS.map((r, i) => clip(`leg${i}`, r))}
        {clip('al', CLAWD_ARM_L)}
        {clip('ar', CLAWD_ARM_R)}
      </defs>
      <g className={styles.clawdBody}>
        <path d={siClaudecode.path} clipPath={`url(#${id}-rest)`} />
        {piece('al', styles.clawdArmL)}
        {piece('ar', styles.clawdArmR)}
        {/* pálpebras: retângulos da cor do corpo por cima dos olhos, para piscar */}
        <rect x="5.95" y="7.45" width="1.6" height="3.1" className={styles.clawdLid} />
        <rect x="16.45" y="7.45" width="1.6" height="3.1" className={styles.clawdLid} />
      </g>
      {CLAWD_LEGS.map(([x], i) => (
        <g key={x}>{piece(`leg${i}`, i % 2 ? styles.clawdLegB : styles.clawdLegA, `${x + 0.8}px 16.45px`)}</g>
      ))}
    </svg>
  );
}

function Clawd({ main }) {
  const id = useId().replace(/:/g, '');
  const ref = useRef(null);
  const [cheers, setCheers] = useState(0);
  const cheerRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    const first = cardsIn(main, 160).find(({ card }) => card.closest('#about')) ?? cardsIn(main, 160)[0];
    if (!first) return undefined;
    const s = {
      card: first.card,
      offset: 0.2, // posição em cima do card (0 = canto esquerdo, 1 = direito)
      target: 0.7,
      dir: 1,
      mode: 'walk', // walk | idle | jump
      until: 0,
      jump: null,
      x: 0,
      y: 0,
    };
    let frame = 0;
    let last = performance.now();

    const pickNext = (now) => {
      // às vezes pula para outro card perto (até ~700px), senão anda até outro ponto deste
      const here = pagePos(s.card, main);
      const near = cardsIn(main, 160).filter(({ card, p }) => card !== s.card && Math.abs(p.y - here.y) < 700);
      if (near.length && Math.random() < 0.4) {
        const { card } = near[Math.floor(Math.random() * near.length)];
        const offset = rand(0.15, 0.85);
        const to = pagePos(card, main);
        s.mode = 'jump';
        s.jump = { from: { x: s.x, y: s.y }, card, offset, start: now, ms: 650 + Math.min(Math.abs(to.y - here.y), 500) };
        s.dir = to.x + to.w * offset > s.x ? 1 : -1;
      } else {
        s.mode = 'walk';
        s.target = rand(0.1, 0.9);
        s.dir = s.target > s.offset ? 1 : -1;
      }
    };

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      const p = pagePos(s.card, main);
      if (!p.w) {
        // o card sumiu (filtro, modal): vai para outro
        const other = cardsIn(main, 160)[0];
        if (other) s.card = other.card;
        return;
      }

      if (cheerRef.current > now) {
        s.mode = 'idle';
      } else if (s.mode === 'walk') {
        s.offset += (s.dir * CLAWD_SPEED * dt) / p.w;
        if ((s.dir > 0 && s.offset >= s.target) || (s.dir < 0 && s.offset <= s.target)) {
          s.offset = s.target;
          s.mode = 'idle';
          s.until = now + rand(900, 3200);
        }
      } else if (s.mode === 'idle' && now >= s.until) {
        pickNext(now);
      }

      if (s.mode === 'jump') {
        const j = s.jump;
        const to = pagePos(j.card, main);
        const tx = to.x + to.w * j.offset;
        const ty = to.y;
        const k = Math.min((now - j.start) / j.ms, 1);
        const peak = Math.min(j.from.y, ty) - 70;
        // parábola passando pela origem, pelo pico e pelo destino
        s.x = j.from.x + (tx - j.from.x) * k;
        s.y = (1 - k) ** 2 * j.from.y + 2 * (1 - k) * k * (2 * peak - (j.from.y + ty) / 2) + k * k * ty;
        if (k >= 1) {
          s.card = j.card;
          s.offset = j.offset;
          s.mode = 'idle';
          s.until = now + rand(800, 2000);
          el.classList.remove(styles.landed);
          void el.offsetWidth;
          el.classList.add(styles.landed);
        }
      } else {
        s.x = p.x + p.w * s.offset;
        s.y = p.y;
      }

      el.style.transform = `translate(${s.x}px, ${s.y}px)`;
      el.style.setProperty('--face', s.dir);
      el.classList.toggle(styles.walking, s.mode === 'walk');
      el.classList.toggle(styles.jumping, s.mode === 'jump');
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [main]);

  const cheer = () => {
    cheerRef.current = performance.now() + 1400;
    setCheers((n) => n + 1);
  };

  return (
    <div ref={ref} className={styles.clawd}>
      <button type="button" className={styles.clawdButton} onClick={cheer} aria-label="Claude Code" title="Claude Code">
        <span key={cheers} className={`${styles.clawdFlip} ${cheers ? styles.cheer : ''}`}>
          <ClawdSprite id={id} />
        </span>
      </button>
    </div>
  );
}

/* ---------- kitty: o gato espia por trás da borda de um card, olha e se esconde ---------- */

function Kitty({ main }) {
  const ref = useRef(null);
  const [spot, setSpot] = useState(null);
  const [meow, setMeow] = useState(false);
  const last = useRef(null);

  useEffect(() => {
    let timer = 0;
    const next = () => {
      // escolhe um card perto de onde ele apareceu da última vez (ou qualquer um)
      const cards = cardsIn(main, 220).filter(
        ({ p }) => !last.current || Math.abs(p.y - last.current) < 1600
      );
      if (!cards.length) return;
      const { card, p } = cards[Math.floor(Math.random() * cards.length)];
      last.current = p.y;
      setMeow(false);
      setSpot({ card, offset: rand(0.15, 0.85), id: Math.random() });
      timer = setTimeout(next, rand(9000, 15000));
    };
    timer = setTimeout(next, 1500);
    return () => clearTimeout(timer);
  }, [main]);

  // acompanha o card (ele pode estar flutuando ou abrindo como livro)
  useEffect(() => {
    if (!spot) return undefined;
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const p = pagePos(spot.card, main);
      if (ref.current) ref.current.style.transform = `translate(${p.x + p.w * spot.offset}px, ${p.y}px)`;
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [spot, main]);

  if (!spot) return null;

  return (
    <div ref={ref} className={styles.kittyHole}>
      {/* janela acima da borda do card: o que estiver abaixo dela fica escondido “atrás do card” */}
      <div className={styles.kittyWindow}>
        <button
          key={spot.id}
          type="button"
          className={`${styles.kittyPeek} ${meow ? styles.kittyHide : ''}`}
          onClick={() => setMeow(true)}
          aria-label="kitty"
          title="kitty"
        >
          <svg viewBox="0 0 24 13" aria-hidden="true">
            <path d={KITTY_HEAD} fillRule="evenodd" />
            <g className={styles.kittyEyes}>
              {KITTY_PUPILS.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
          </svg>
        </button>
      </div>
      {meow && <span className={styles.meow}>miau</span>}
    </div>
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
          <Butterfly main={main} />
          <Clawd main={main} />
          <Kitty main={main} />
        </div>,
        main
      )}
    </>
  );
}
