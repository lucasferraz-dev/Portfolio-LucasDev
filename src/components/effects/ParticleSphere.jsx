import { useEffect, useRef } from 'react';
import { useTheme } from '../../theme/useTheme';

const COLORS = { dark: [0, 204, 85], light: [0, 134, 58] };

const CYCLE = { sphere: 4500, expand: 2600, network: 4000, contract: 2600 };
const CYCLE_TOTAL = CYCLE.sphere + CYCLE.expand + CYCLE.network + CYCLE.contract;

const NETWORK_EVERY = 13;
const FOV = 6;
const MAX_DPR = 1.5;
const ALPHA_LEVELS = 10;

const alphaBucket = (alpha) => Math.min(ALPHA_LEVELS - 1, Math.floor(alpha * ALPHA_LEVELS));
const bucketAlpha = (bucket) => (bucket + 0.5) / ALPHA_LEVELS;
const createBuckets = () => Array.from({ length: ALPHA_LEVELS }, () => []);

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

    const dotBuckets = createBuckets();
    const nodeBuckets = createBuckets();
    const lineBuckets = createBuckets();
    const nodes = [];

    const draw = (elapsed) => {
      const [r, g, b] = colorRef.current;
      const color = `rgb(${r}, ${g}, ${b})`;
      const isNarrow = width < 640;

      const cx = width / 2;
      const cy = height * (isNarrow ? 0.4 : 0.48);
      const radius = Math.min(width, height) * (isNarrow ? 0.4 : 0.34);
      const linkDistance = radius * 0.5;
      const linkDistanceSq = linkDistance * linkDistance;

      const morph = getMorph(elapsed % CYCLE_TOTAL);
      const angle = elapsed * 0.00015;
      const tilt = 0.4 + Math.sin(elapsed * 0.0002) * 0.1;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      for (let i = 0; i < ALPHA_LEVELS; i++) {
        dotBuckets[i].length = 0;
        nodeBuckets[i].length = 0;
        lineBuckets[i].length = 0;
      }
      nodes.length = 0;

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
          nodeBuckets[alphaBucket(depth)].push(sx, sy, 1.5 + local * 1.6);
          nodes.push({ sx, sy, local, depth });
        } else {
          dotBuckets[alphaBucket(depth * (1 - 0.75 * local))].push(sx, sy, 1.7 * scale);
        }
      }

      if (morph > 0) {
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          if (a.local < 0.2) continue;

          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            if (b.local < 0.2) continue;

            const dx = a.sx - b.sx;
            const dy = a.sy - b.sy;
            const distanceSq = dx * dx + dy * dy;
            if (distanceSq > linkDistanceSq) continue;

            const alpha =
              (1 - Math.sqrt(distanceSq) / linkDistance) * Math.min(a.local, b.local) * ((a.depth + b.depth) / 2) * 0.85;
            if (alpha < 0.02) continue;
            lineBuckets[alphaBucket(alpha)].push(a.sx, a.sy, b.sx, b.sy);
          }
        }
      }

      for (let level = 0; level < ALPHA_LEVELS; level++) {
        const dots = dotBuckets[level];
        const circles = nodeBuckets[level];
        const lines = lineBuckets[level];
        if (!dots.length && !circles.length && !lines.length) continue;

        ctx.globalAlpha = bucketAlpha(level);

        if (lines.length) {
          ctx.beginPath();
          for (let i = 0; i < lines.length; i += 4) {
            ctx.moveTo(lines[i], lines[i + 1]);
            ctx.lineTo(lines[i + 2], lines[i + 3]);
          }
          ctx.stroke();
        }

        if (dots.length || circles.length) {
          ctx.beginPath();
          for (let i = 0; i < dots.length; i += 3) {
            const size = dots[i + 2];
            ctx.rect(dots[i] - size / 2, dots[i + 1] - size / 2, size, size);
          }
          for (let i = 0; i < circles.length; i += 3) {
            ctx.moveTo(circles[i] + circles[i + 2], circles[i + 1]);
            ctx.arc(circles[i], circles[i + 1], circles[i + 2], 0, Math.PI * 2);
          }
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
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
