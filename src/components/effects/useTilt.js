import { useRef } from 'react';

/*
 * Inclina um card em 3D na direção da ponta onde o mouse está.
 * Escreve --rx/--ry (ângulos) e --gx/--gy (posição do brilho) direto no elemento,
 * sem re-renderizar. Só reage a mouse; no toque não faz nada.
 */
export default function useTilt(maxTilt = 14) {
  const ref = useRef(null);

  const onPointerMove = (event) => {
    if (event.pointerType !== 'mouse') return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty('--ry', `${(x - 0.5) * 2 * maxTilt}deg`);
    el.style.setProperty('--rx', `${(0.5 - y) * 2 * maxTilt}deg`);
    el.style.setProperty('--gx', `${x * 100}%`);
    el.style.setProperty('--gy', `${y * 100}%`);
  };

  const onPointerLeave = () => {
    const el = ref.current;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return { ref, onPointerMove, onPointerLeave };
}
