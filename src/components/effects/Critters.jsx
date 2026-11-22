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

/* ---------- Borboleta do Wiki.js: passeia, fica curiosa com o mouse, pousa nele e se assusta ---------- */

/*
 * Modos:
 *  wander  passeia por uma região do site e às vezes vai pousar num card
 *  card    pousada num card, abrindo e fechando as asas devagar
 *  curious o mouse chegou perto: ela voa em volta do cursor
 *  cursor  o mouse ficou paradinho: ela pousa na ponta dele e vai junto devagar
 *  flee    o mouse se mexeu rápido (ou ela foi clicada): foge assustada
 *  loop    foi clicada: dá um looping soltando brilhinhos e depois foge
 */
const CURIOUS_RADIUS = 230;
const SCARE_SPEED = 16; // px por quadro: mais rápido que isso assusta
const STILL_SPEED = 0.6; // px por quadro: mais devagar que isso é “mouse parado”

function Butterfly({ main }) {
  const id = useId().replace(/:/g, '');
  const ref = useRef(null);
  const loopRef = useRef(() => {});
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const el = ref.current;
    const home = document.getElementById('about') ?? main;
    const s = {
      x: rand(120, main.offsetWidth - 120),
      y: pagePos(home, main).y + rand(80, 280),
      vx: 0,
      vy: 0,
      mode: 'wander',
      target: null,
      perch: null,
      until: 0,
      cooldown: 0, // até quando ela não fica curiosa de novo
      stillSince: 0,
      orbit: Math.random() * Math.PI * 2,
      loop: null,
      t: Math.random() * 1000,
      bank: 0,
    };
    const mouse = { x: -9999, y: -9999, speed: 0, inside: false };
    let frame = 0;
    let last = performance.now();

    const onMove = (event) => {
      const m = main.getBoundingClientRect();
      const x = event.clientX - m.left;
      const y = event.clientY - m.top;
      // no primeiro movimento não há posição anterior: não conta como puxão
      if (mouse.inside) mouse.speed = Math.max(mouse.speed, Math.hypot(x - mouse.x, y - mouse.y));
      mouse.x = x;
      mouse.y = y;
      mouse.inside = true;
    };
    const onLeave = () => {
      mouse.inside = false;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    const pickTarget = () => {
      const cards = [...main.querySelectorAll('[data-sticky]')]
        .map((card) => ({ card, p: pagePos(card, main) }))
        .filter(({ p }) => p.w > 0 && Math.abs(p.y - s.y) < 700);
      if (cards.length && Math.random() < 0.35) {
        const { card } = cards[Math.floor(Math.random() * cards.length)];
        s.target = { card, offset: rand(0.15, 0.85) };
      } else {
        const y = Math.min(Math.max(s.y + rand(-450, 450), 80), main.offsetHeight - 80);
        s.target = { x: rand(60, main.offsetWidth - 60), y };
      }
    };

    const flee = (now, strength = 1) => {
      const dx = s.x - mouse.x;
      const dy = s.y - mouse.y;
      const d = Math.hypot(dx, dy) || 1;
      s.vx = (dx / d) * 7 * strength + rand(-1, 1);
      s.vy = (dy / d) * 7 * strength - 2;
      s.mode = 'flee';
      s.until = now + 900;
      s.cooldown = now + 4500;
      s.perch = null;
      s.target = null;
    };

    // clique: looping no ar com brilhinhos, depois foge
    loopRef.current = () => {
      const now = performance.now();
      s.mode = 'loop';
      s.perch = null;
      s.loop = { cx: s.x, cy: s.y - 34, start: now, from: s.x, fromY: s.y };
      setSparkles((list) => [...list.slice(-3), { id: now, x: s.x, y: s.y - 34 }]);
    };

    const steer = (tx, ty, pull, max, dt) => {
      const dx = tx - s.x;
      const dy = ty - s.y;
      const dist = Math.hypot(dx, dy) || 1;
      s.vx += (dx / dist) * pull * dt;
      s.vy += (dy / dist) * pull * dt;
      const speed = Math.hypot(s.vx, s.vy);
      if (speed > max) {
        s.vx = (s.vx / speed) * max;
        s.vy = (s.vy / speed) * max;
      }
      return dist;
    };

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      s.t += dt;
      const mouseDist = Math.hypot(mouse.x - s.x, mouse.y - s.y);
      const scared = mouse.speed > SCARE_SPEED && mouseDist < 160;
      if (mouse.speed < STILL_SPEED) {
        if (!s.stillSince) s.stillSince = now;
      } else s.stillSince = 0;

      // mudanças de modo que dependem do mouse
      if (scared && (s.mode === 'curious' || s.mode === 'cursor')) flee(now, 1.2);
      else if (
        mouse.inside &&
        mouseDist < CURIOUS_RADIUS &&
        now > s.cooldown &&
        (s.mode === 'wander' || s.mode === 'card')
      ) {
        s.mode = 'curious';
        s.perch = null;
        s.until = now + rand(9000, 14000);
      }

      let flap = 'fly';

      if (s.mode === 'loop') {
        // volta completa em torno de um ponto acima de onde estava
        const k = Math.min((now - s.loop.start) / 900, 1);
        const a = Math.PI / 2 + k * Math.PI * 2;
        s.x = s.loop.cx + Math.cos(a) * 34;
        s.y = s.loop.cy + Math.sin(a) * 34;
        s.bank = -k * 360;
        if (k >= 1) {
          s.bank = 0;
          flee(now, 0.8);
        }
      } else if (s.mode === 'cursor') {
        // pousada na ponta do cursor: vai junto, devagar
        s.x += (mouse.x + 8 - s.x) * Math.min(0.35 * dt, 1);
        s.y += (mouse.y - 4 - s.y) * Math.min(0.35 * dt, 1);
        s.vx = 0;
        s.vy = 0;
        flap = 'rest';
        if (now > s.until || !mouse.inside) {
          s.mode = 'wander';
          s.cooldown = now + 3000;
          s.vy = -2.5;
        }
      } else if (s.mode === 'curious') {
        // voa em volta do cursor, numa órbita que muda de tamanho
        s.orbit += 0.045 * dt;
        const r = 44 + Math.sin(s.t * 0.05) * 14;
        steer(mouse.x + Math.cos(s.orbit) * r, mouse.y - 18 + Math.sin(s.orbit) * r * 0.55, 0.22, 3.2, dt);
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        // mouse paradinho e ela pertinho: pousa na ponta dele
        if (s.stillSince && now - s.stillSince > 1100 && mouseDist < 80) {
          s.mode = 'cursor';
          s.until = now + rand(8000, 14000);
        }
        if (now > s.until || !mouse.inside || mouseDist > CURIOUS_RADIUS * 1.6) {
          s.mode = 'wander';
          s.cooldown = now + 3500;
        }
      } else if (s.mode === 'card') {
        const p = pagePos(s.perch.card, main);
        s.x = p.x + p.w * s.perch.offset;
        s.y = p.y - 6;
        flap = 'rest';
        if (now >= s.until) {
          s.mode = 'wander';
          s.perch = null;
          s.vy = -2.5;
          pickTarget();
        }
      } else {
        if (s.mode === 'flee' && now > s.until) s.mode = 'wander';
        if (s.mode === 'wander') {
          if (!s.target) pickTarget();
          const tp = s.target.card
            ? (() => {
                const p = pagePos(s.target.card, main);
                return { x: p.x + p.w * s.target.offset, y: p.y - 6 };
              })()
            : s.target;
          // voo orgânico: o vento muda devagar (duas ondas de ritmos diferentes)
          s.vx += (Math.sin(s.t * 0.031) + Math.sin(s.t * 0.087)) * 0.035 * dt;
          s.vy += (Math.cos(s.t * 0.027) + Math.sin(s.t * 0.071)) * 0.035 * dt;
          const dist = steer(tp.x, tp.y, 0.06, 2.1, dt);
          if (dist < 12) {
            if (s.target.card) {
              s.mode = 'card';
              s.perch = s.target;
              s.until = now + rand(2500, 6000);
            }
            s.target = null;
          }
        } else {
          s.vx *= 0.97;
          s.vy *= 0.97;
        }
        s.x += s.vx * dt;
        s.y += s.vy * dt;
      }

      // inclina nas curvas, como se fizesse curva no ar
      if (s.mode !== 'loop') s.bank += (Math.max(Math.min(s.vx * 9, 28), -28) - s.bank) * Math.min(0.15 * dt, 1);
      s.x = Math.min(Math.max(s.x, 20), main.offsetWidth - 20);
      s.y = Math.min(Math.max(s.y, 30), main.offsetHeight - 30);

      el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.bank}deg)`;
      el.dataset.flap = s.mode === 'flee' ? 'fast' : flap;
      el.dataset.mode = s.mode;
      mouse.speed *= 0.6;
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
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
    <>
      <div ref={ref} className={styles.butterfly}>
        <button type="button" className={styles.butterflyHit} onClick={() => loopRef.current()} aria-label="Wiki.js" title="Wiki.js">
          <span className={styles.flapBob}>
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
          </span>
        </button>
      </div>
      {sparkles.map((burst) => (
        <span key={burst.id} className={styles.sparkles} style={{ left: burst.x, top: burst.y }}>
          {Array.from({ length: 8 }, (_, i) => (
            <i key={i} style={{ '--a': `${i * 45}deg` }} />
          ))}
        </span>
      ))}
    </>
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

/* ---------- kitty: esconde-esconde atrás dos cards ---------- */

const KITTY_SEEN_MS = 5800; // quanto tempo ele fica depois que alguém o encontra
const KITTY_HIDE_MS = 450; // tempo para se abaixar antes de trocar de card

/*
 * O gato está sempre espiando por trás da borda de algum card. Enquanto ninguém
 * o encontra, ele fica lá. Quando ele aparece na tela, fica uns segundos (dá
 * tempo de clicar), depois se abaixa e vai se esconder atrás de outro card, de
 * preferência um que não esteja na tela. Ao ser clicado, mia, fecha os olhinhos
 * feliz e vai para outro esconderijo.
 */
function Kitty({ main }) {
  const ref = useRef(null);
  const [spot, setSpot] = useState(null);
  const [phase, setPhase] = useState('peek'); // peek | happy | hide

  // escolhe um esconderijo; se der, um card fora da tela (para ser achado depois)
  const relocate = useRef(() => {});
  relocate.current = (avoid) => {
    const cards = cardsIn(main, 220).filter(({ card }) => card !== avoid);
    if (!cards.length) return;
    const top = -main.getBoundingClientRect().top;
    const offscreen = cards.filter(({ p }) => p.y < top - 40 || p.y > top + window.innerHeight + 40);
    const pool = offscreen.length ? offscreen : cards;
    const { card } = pool[Math.floor(Math.random() * pool.length)];
    setSpot({ card, offset: rand(0.15, 0.85), id: Math.random() });
    setPhase('peek');
  };

  useEffect(() => {
    const timer = setTimeout(() => relocate.current(null), 1200);
    return () => clearTimeout(timer);
  }, [main]);

  // acompanha o card e percebe quando alguém o encontrou
  useEffect(() => {
    if (!spot) return undefined;
    let frame = 0;
    let seenAt = 0;
    let leaving = 0;

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const p = pagePos(spot.card, main);
      if (!p.w) {
        relocate.current(spot.card);
        return;
      }
      if (ref.current) ref.current.style.transform = `translate(${p.x + p.w * spot.offset}px, ${p.y}px)`;

      // está na tela? (a borda do card entre o topo e o pé da janela)
      const screenY = p.y + main.getBoundingClientRect().top;
      const visible = screenY > 70 && screenY < window.innerHeight - 20;
      if (visible && !seenAt) seenAt = now;
      if (seenAt && !leaving && now - seenAt > KITTY_SEEN_MS) {
        leaving = now;
        setPhase('hide');
      }
      if (leaving && now - leaving > KITTY_HIDE_MS) {
        leaving = 0;
        relocate.current(spot.card);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [spot, main]);

  const poke = () => {
    if (phase !== 'peek') return;
    setPhase('happy');
    const card = spot.card;
    setTimeout(() => setPhase('hide'), 1300);
    setTimeout(() => relocate.current(card), 1300 + KITTY_HIDE_MS);
  };

  if (!spot) return null;

  return (
    <div ref={ref} className={styles.kittyHole}>
      {/* janela acima da borda do card: o que estiver abaixo dela fica escondido “atrás do card” */}
      <div className={styles.kittyWindow}>
        <button
          key={spot.id}
          type="button"
          className={`${styles.kittyPeek} ${phase === 'hide' ? styles.kittyHide : ''} ${phase === 'happy' ? styles.kittyHappy : ''}`}
          onClick={poke}
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
            {/* olhinhos fechados de feliz (^ ^): tampa os olhos e desenha o arquinho por cima */}
            <g className={styles.kittyJoy}>
              <ellipse cx="9.5" cy="7.6" rx="1.05" ry="1.25" />
              <ellipse cx="14.4" cy="7.6" rx="1.05" ry="1.25" />
              <path d="M8.7 8.1l.8-.8.8.8M13.6 8.1l.8-.8.8.8" />
            </g>
          </svg>
        </button>
      </div>
      {phase === 'happy' && <span className={styles.meow}>miau</span>}
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
