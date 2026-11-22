import { useEffect, useRef } from 'react';
import styles from './Keychains.module.css';

/*
 * Chaveiros pendurados embaixo de um card: argola, correntinha e uma plaquinha
 * com o logo de cada tecnologia. Eles não saem dali, mas dá para segurar e
 * arrastar para o lado: o chaveiro gira em volta da argola seguindo o mouse e,
 * ao soltar, balança como pêndulo até parar (a plaquinha balança um pouco
 * atrasada, como um pingente). De vez em quando um ventinho os mexe de leve.
 */
const GRAVITY = 22; // (g / comprimento) em 1/s²: define o ritmo do balanço
const DAMPING = 1.1; // quanto o balanço perde por segundo
const MAX_ANGLE = 1.35; // até onde dá para puxar (radianos, ~77°)

export default function Keychains({ items, side = 'left' }) {
  const refs = useRef([]);
  const state = useRef([]);

  useEffect(() => {
    state.current = items.map((_, i) => ({ angle: (i % 2 ? -1 : 1) * 0.08, speed: 0, drag: null }));
    let frame = 0;
    let last = performance.now();
    let nextBreeze = last + 3000;

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 50) / 1000;
      last = now;

      // ventinho: um empurrãozinho aleatório de vez em quando
      if (now > nextBreeze) {
        state.current.forEach((s) => {
          if (!s.drag) s.speed += (Math.random() - 0.5) * 0.5;
        });
        nextBreeze = now + 3500 + Math.random() * 4000;
      }

      state.current.forEach((s, i) => {
        const el = refs.current[i];
        if (!el) return;
        if (s.drag) {
          // segue o mouse com uma molinha (não teletransporta)
          const before = s.angle;
          s.angle += (s.drag.target - s.angle) * Math.min(dt * 18, 1);
          s.speed = (s.angle - before) / (dt || 1 / 60);
        } else {
          s.speed += (-GRAVITY * Math.sin(s.angle) - DAMPING * s.speed) * dt;
          s.angle += s.speed * dt;
        }
        el.style.setProperty('--swing', `${s.angle}rad`);
        // o pingente fica para trás quando o chaveiro acelera
        el.style.setProperty('--lag', `${Math.max(Math.min(-s.speed * 0.06, 0.5), -0.5)}rad`);
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
              <path d={icon.path} fill={`#${icon.hex}`} />
            </svg>
          </span>
        </div>
      ))}
    </div>
  );
}
