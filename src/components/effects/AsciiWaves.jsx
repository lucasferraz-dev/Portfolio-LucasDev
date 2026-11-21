import { useEffect, useRef } from 'react';
import { useTheme } from '../../theme/useTheme';

/*
 * Fundo de ondas em ASCII.
 * A tela vira uma grade de caracteres e cada célula escolhe um caractere da
 * RAMP conforme a altura de um campo de ondas (soma de senos que andam no
 * tempo). Onde a onda é mais alta o caractere é mais denso e mais verde.
 * O mouse solta uma ondulação circular em volta do cursor.
 */
const RAMP = ' .·:-=+*#%';
const CELL = 16;
const FPS = 30;
const MAX_DPR = 1.5;

const PALETTE = {
  dark: { base: [148, 163, 184], accent: [0, 204, 85], maxAlpha: 0.3 },
  light: { base: [71, 85, 105], accent: [0, 134, 58], maxAlpha: 0.26 },
};

function waveAt(col, row, t, mouse) {
  let v =
    Math.sin(col * 0.09 + t * 0.9 + Math.sin(row * 0.05 + t * 0.3) * 2) +
    Math.sin(row * 0.16 - t * 0.6 + col * 0.02) * 0.8 +
    Math.sin((col + row) * 0.04 + t * 0.4) * 0.6;

  if (mouse.active) {
    const dx = col - mouse.col;
    const dy = (row - mouse.row) * 2;
    const dist = Math.sqrt(dx * dx + dy * dy);
    v += Math.sin(dist * 0.55 - t * 5) * 1.6 * Math.exp(-dist / 10);
  }

  // normaliza de [-2.4, 2.4] para [0, 1] e achata para deixar mais vazio
  const n = Math.min(Math.max((v + 2.4) / 4.8, 0), 1);
  return n * n;
}

export default function AsciiWaves({ className }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const paletteRef = useRef(PALETTE[theme]);

  useEffect(() => {
    paletteRef.current = PALETTE[theme];
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { col: 0, row: 0, active: false };
    let cols = 0;
    let rows = 0;
    let frame = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${CELL - 4}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      cols = Math.ceil(w / (CELL * 0.75));
      rows = Math.ceil(h / CELL);
    };

    const draw = (now) => {
      const t = now / 1000;
      const { base, accent, maxAlpha } = paletteRef.current;
      const stepX = CELL * 0.75;

      // agrupa as células por caractere para trocar de cor poucas vezes
      const buckets = Array.from({ length: RAMP.length }, () => []);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const level = Math.floor(waveAt(col, row, t, mouse) * (RAMP.length - 1) + 0.5);
          if (level > 0) buckets[level].push(col, row);
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let level = 1; level < RAMP.length; level++) {
        const cells = buckets[level];
        if (!cells.length) continue;
        const k = level / (RAMP.length - 1);
        const [r, g, b] = k > 0.6 ? accent : base;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(0.25 + k * 0.75) * maxAlpha})`;
        const char = RAMP[level];
        for (let i = 0; i < cells.length; i += 2) {
          ctx.fillText(char, cells[i] * stepX + stepX / 2, cells[i + 1] * CELL + CELL / 2);
        }
      }
    };

    const loop = (now) => {
      frame = requestAnimationFrame(loop);
      if (document.hidden || now - last < 1000 / FPS) return;
      last = now;
      draw(now);
    };

    const onMove = (event) => {
      mouse.col = event.clientX / (CELL * 0.75);
      mouse.row = event.clientY / CELL;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };
    const onResize = () => {
      resize();
      if (reduceMotion) draw(0);
    };

    resize();
    window.addEventListener('resize', onResize);

    if (reduceMotion) {
      draw(0);
    } else {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
