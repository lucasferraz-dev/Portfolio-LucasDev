/*
 * Worker que desenha o fundo de ondas ASCII num OffscreenCanvas, fora da thread
 * principal. Assim o desenho não disputa tempo com o mouse, o scroll e as
 * animações da página.
 */
import { createAsciiRenderer, FPS } from './asciiRenderer';

let renderer = null;
let timer = 0;
let visible = true;
let still = false;

const tick = () => {
  timer = 0;
  if (!renderer || !visible) return;
  renderer.draw(performance.now());
  if (!still) timer = setTimeout(tick, 1000 / FPS);
};

const restart = () => {
  clearTimeout(timer);
  tick();
};

self.onmessage = ({ data }) => {
  switch (data.type) {
    case 'init':
      renderer = createAsciiRenderer(data.canvas);
      renderer.setPalette(data.palette);
      renderer.resize(data.width, data.height, data.dpr);
      still = data.still;
      restart();
      break;
    case 'resize':
      renderer?.resize(data.width, data.height, data.dpr);
      if (still) restart();
      break;
    case 'palette':
      renderer?.setPalette(data.palette);
      if (still) restart();
      break;
    case 'mouse':
      renderer?.setMouse(data.x, data.y, data.active);
      break;
    case 'visible':
      visible = data.visible;
      if (visible) restart();
      break;
    default:
  }
};
