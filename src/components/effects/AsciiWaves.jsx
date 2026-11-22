import { useEffect, useRef } from 'react';
import { useTheme } from '../../theme/useTheme';
import { createAsciiRenderer, FPS, PALETTE } from './asciiRenderer';

/*
 * Fundo de ondas em ASCII atrás do site inteiro.
 * Quando o navegador permite, o canvas é entregue a um Web Worker
 * (OffscreenCanvas) e desenhado fora da thread principal, para não deixar o
 * mouse, o scroll e as outras animações travados. Sem suporte, desenha aqui
 * mesmo. O canvas é criado dentro do efeito porque um canvas só pode ser
 * transferido uma vez (e o StrictMode monta o efeito duas vezes).
 */
export default function AsciiWaves({ className }) {
  const hostRef = useRef(null);
  const sendRef = useRef(() => {});
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
    sendRef.current({ type: 'palette', palette: PALETTE[theme] });
  }, [theme]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    host.appendChild(canvas);

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const size = () => ({ width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio });
    let stop = () => {};

    if (typeof Worker !== 'undefined' && 'transferControlToOffscreen' in canvas) {
      const offscreen = canvas.transferControlToOffscreen();
      const worker = new Worker(new URL('./asciiWaves.worker.js', import.meta.url), { type: 'module' });
      worker.postMessage({ type: 'init', canvas: offscreen, palette: PALETTE[themeRef.current], still, ...size() }, [offscreen]);
      sendRef.current = (message) => worker.postMessage(message);
      stop = () => worker.terminate();
    } else {
      // fallback: desenha na thread principal
      const renderer = createAsciiRenderer(canvas);
      const { width, height, dpr } = size();
      renderer.setPalette(PALETTE[themeRef.current]);
      renderer.resize(width, height, dpr);
      let frame = 0;
      let last = 0;
      let visible = true;

      const loop = (now) => {
        frame = requestAnimationFrame(loop);
        if (!visible || now - last < 1000 / FPS) return;
        last = now;
        renderer.draw(now);
      };

      sendRef.current = (message) => {
        if (message.type === 'resize') renderer.resize(message.width, message.height, message.dpr);
        if (message.type === 'palette') renderer.setPalette(message.palette);
        if (message.type === 'mouse') renderer.setMouse(message.x, message.y, message.active);
        if (message.type === 'visible') visible = message.visible;
        if (still) renderer.draw(0);
      };

      if (still) renderer.draw(0);
      else frame = requestAnimationFrame(loop);
      stop = () => cancelAnimationFrame(frame);
    }

    const send = (message) => sendRef.current(message);
    const onResize = () => send({ type: 'resize', ...size() });
    const onMove = (event) => send({ type: 'mouse', x: event.clientX, y: event.clientY, active: true });
    const onLeave = () => send({ type: 'mouse', x: 0, y: 0, active: false });
    const onVisibility = () => send({ type: 'visible', visible: !document.hidden });

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    if (!still) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
    }

    return () => {
      stop();
      sendRef.current = () => {};
      canvas.remove();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
