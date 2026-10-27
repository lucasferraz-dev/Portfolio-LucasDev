import { useEffect, useRef } from 'react';
import { useTheme } from '../../theme/useTheme';

const COLORS = { dark: [0, 204, 85], light: [0, 134, 58] };

const CYCLE = { sphere: 4500, expand: 2600, network: 4000, contract: 2600 };
const CYCLE_TOTAL = CYCLE.sphere + CYCLE.expand + CYCLE.network + CYCLE.contract;

const NETWORK_EVERY = 13;
const FOV = 6;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function createPoints(count) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const jitter = () => (Math.random() - 0.5) * 0.6;

  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const sphere = [Math.cos(theta) * ring, y, Math.sin(theta) * ring];
    const spread = 1.5 + Math.random() * 1.1;

    return {
      sphere,
      cloud: sphere.map((axis) => axis * spread + jitter()),
      delay: Math.random(),
      phase: Math.random() * Math.PI * 2,
      network: i % NETWORK_EVERY === 0,
    };
  });
}

function getMorph(time) {
  let t = time;
  if (t < CYCLE.sphere) return 0;
  t -= CYCLE.sphere;
  if (t < CYCLE.expand) return t / CYCLE.expand;
  t -= CYCLE.expand;
  if (t < CYCLE.network) return 1;
  t -= CYCLE.network;
  return 1 - t / CYCLE.contract;
}

export default function ParticleSphere({ className }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const colorRef = useRef(COLORS[theme]);

  useEffect(() => {
    colorRef.current = COLORS[theme];
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const start = performance.now();

    let width = 0;
    let height = 0;
    let points = [];
    let frameId = null;

    const draw = (elapsed) => {
      const [r, g, b] = colorRef.current;
      const color = `rgb(${r}, ${g}, ${b})`;
      const isNarrow = width < 640;

      const cx = width / 2;
      const cy = height * (isNarrow ? 0.4 : 0.48);
      const radius = Math.min(width, height) * (isNarrow ? 0.4 : 0.34);
      const linkDistance = radius * 0.5;

      const morph = getMorph(elapsed % CYCLE_TOTAL);
      const angle = elapsed * 0.00015;
      const tilt = 0.4 + Math.sin(elapsed * 0.0002) * 0.1;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      const nodes = [];

      for (const p of points) {
        const local = easeInOut(clamp(morph * 1.3 - p.delay * 0.3));
        const drift = Math.sin(elapsed * 0.0008 + p.phase) * 0.08 * local;

        const x = lerp(p.sphere[0], p.cloud[0], local) + drift;
        const y = lerp(p.sphere[1], p.cloud[1], local) - drift;
        const z = lerp(p.sphere[2], p.cloud[2], local);

        const x1 = x * cosA + z * sinA;
        const z1 = -x * sinA + z * cosA;
        const y2 = y * cosT - z1 * sinT;
        const z2 = y * sinT + z1 * cosT;

        const scale = FOV / (FOV + z2);
        const sx = cx + x1 * radius * scale;
        const sy = cy + y2 * radius * scale;
        const depth = clamp(0.7 - z2 * 0.4, 0.2, 1);

        if (p.network) {
          const size = 1.5 + local * 1.6;
          ctx.globalAlpha = depth;
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();
          nodes.push({ sx, sy, local, depth });
        } else {
          const size = 1.7 * scale;
          ctx.globalAlpha = depth * (1 - 0.75 * local);
          ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
        }
      }

      if (morph > 0) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;

        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          if (a.local < 0.2) continue;

          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            if (b.local < 0.2) continue;

            const distance = Math.hypot(a.sx - b.sx, a.sy - b.sy);
            if (distance > linkDistance) continue;

            ctx.globalAlpha =
              (1 - distance / linkDistance) * Math.min(a.local, b.local) * ((a.depth + b.depth) / 2) * 0.85;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < 640 ? 1000 : 2200;
      if (points.length !== count) points = createPoints(count);
    };

    const loop = (now) => {
      draw(now - start);
      frameId = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (!frameId) frameId = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      cancelAnimationFrame(frameId);
      frameId = null;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startLoop();
      else stopLoop();
    });
    visibilityObserver.observe(canvas);

    resize();

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
