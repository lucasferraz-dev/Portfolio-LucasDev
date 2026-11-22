import { useEffect, useRef } from 'react';
import styles from './Keychains.module.css';

/*
 * Chaveiros pendurados embaixo de um card: argola, correntinha e um medalhão
 * redondo de metal escuro com o logo de cada tecnologia. Eles não saem dali,
 * mas dá para segurar e arrastar para o lado: o chaveiro gira em volta da
 * argola seguindo o mouse e, ao soltar, balança como pêndulo. Os medalhões são
 * círculos que batem uns nos outros: empurrar um contra o vizinho joga o
 * vizinho para o lado, que pode bater no próximo, em cadeia.
 */
const GRAVITY = 22; // (g / comprimento) em 1/s²: define o ritmo do balanço
const DAMPING = 1.1; // quanto o balanço perde por segundo
const MAX_ANGLE = 1.35; // até onde dá para puxar (radianos, ~77°)
const ARM = 50; // distância da argola ao centro do medalhão (px)
const RADIUS = 23; // raio do medalhão (px), usado na colisão
const BOUNCE = 0.75; // quanto da velocidade sobra numa batida

// logos muito escuros ficam brancos para aparecer no metal escuro
function charmColor(hex) {
  const n = parseInt(hex, 16);
  const luminance = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return luminance < 0.28 ? 'var(--color-white)' : `#${hex}`;
}

export default function Keychains({ items, side = 'left' }) {
  const refs = useRef([]);
  const state = useRef([]);

  useEffect(() => {
    state.current = items.map((_, i) => ({ angle: (i % 2 ? -1 : 1) * 0.06, speed: 0, drag: null, pivot: 0 }));
    let frame = 0;
    let last = performance.now();
    let nextBreeze = last + 3000;

    // posição horizontal de cada argola dentro da fileira (o chaveiro gira em volta dela)
    const measurePivots = () => {
      state.current.forEach((s, i) => {
        const el = refs.current[i];
        if (el) s.pivot = el.offsetLeft + el.offsetWidth / 2;
      });
    };

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 50) / 1000;
      last = now;
      const list = state.current;
      measurePivots();

      // ventinho: um empurrãozinho aleatório de vez em quando
      if (now > nextBreeze) {
        list.forEach((s) => {
          if (!s.drag) s.speed += (Math.random() - 0.5) * 0.5;
        });
        nextBreeze = now + 3500 + Math.random() * 4000;
      }

      list.forEach((s) => {
        if (s.drag) {
          // segue o mouse com uma molinha (não teletransporta)
          const before = s.angle;
          s.angle += (s.drag.target - s.angle) * Math.min(dt * 18, 1);
          s.speed = (s.angle - before) / (dt || 1 / 60);
        } else {
          s.speed += (-GRAVITY * Math.sin(s.angle) - DAMPING * s.speed) * dt;
          s.angle += s.speed * dt;
        }
      });

      // batidas entre vizinhos: se os medalhões se sobrepõem, afasta e troca o impulso
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < list.length - 1; i++) {
          const a = list[i];
          const b = list[i + 1];
          // girar no sentido horário leva o medalhão para a esquerda
          const ax = a.pivot - ARM * Math.sin(a.angle);
          const ay = ARM * Math.cos(a.angle);
          const bx = b.pivot - ARM * Math.sin(b.angle);
          const by = ARM * Math.cos(b.angle);
          const dist = Math.hypot(bx - ax, by - ay);
          const overlap = 2 * RADIUS - dist;
          if (overlap <= 0) continue;

          // quem está sendo segurado não é empurrado; o outro leva tudo
          const share = a.drag ? 0 : b.drag ? 1 : 0.5;
          const turn = overlap / ARM;
          a.angle += turn * share;
          b.angle -= turn * (1 - share);

          // velocidade horizontal de cada um (positivo = para a direita)
          const va = -ARM * Math.cos(a.angle) * a.speed;
          const vb = -ARM * Math.cos(b.angle) * b.speed;
          if (va > vb) {
            if (a.drag) b.speed = (-va * (1 + BOUNCE) / 2) / (ARM * Math.cos(b.angle));
            else if (b.drag) a.speed = (-vb * (1 + BOUNCE) / 2) / (ARM * Math.cos(a.angle));
            else {
              const sa = a.speed;
              a.speed = b.speed * BOUNCE;
              b.speed = sa * BOUNCE;
            }
          }
        }
      }

      list.forEach((s, i) => {
        s.angle = Math.max(Math.min(s.angle, MAX_ANGLE), -MAX_ANGLE);
        const el = refs.current[i];
        if (!el) return;
        el.style.setProperty('--swing', `${s.angle}rad`);
        // o medalhão fica para trás quando o chaveiro acelera
        el.style.setProperty('--lag', `${Math.max(Math.min(-s.speed * 0.05, 0.4), -0.4)}rad`);
      });
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [items]);

  const grab = (index) => (event) => {
    event.preventDefault();
    const s = state.current[index];
    const pivot = refs.current[index].querySelector(`.${styles.ring}`).getBoundingClientRect();
    const px = pivot.left + pivot.width / 2;
    const py = pivot.top + pivot.height / 2;

    const aim = (e) => {
      // ângulo do mouse em relação à argola (0 = pendurado reto para baixo)
      const angle = -Math.atan2(e.clientX - px, Math.max(e.clientY - py, 8));
      s.drag = { target: Math.max(Math.min(angle, MAX_ANGLE), -MAX_ANGLE) };
    };
    const release = () => {
      s.drag = null;
      window.removeEventListener('pointermove', aim);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      refs.current[index]?.classList.remove(styles.held);
    };

    aim(event);
    refs.current[index].classList.add(styles.held);
    window.addEventListener('pointermove', aim);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
  };

  return (
    <div className={`${styles.keychains} ${side === 'right' ? styles.right : ''}`}>
      {items.map(({ name, icon }, i) => (
        <div key={name} ref={(el) => (refs.current[i] = el)} className={styles.keychain}>
          <span className={styles.ring} aria-hidden="true" />
          <span className={styles.chain} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={styles.charm} onPointerDown={grab(i)} title={name}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={icon.path} fill={charmColor(icon.hex)} />
            </svg>
          </span>
        </div>
      ))}
    </div>
  );
}
