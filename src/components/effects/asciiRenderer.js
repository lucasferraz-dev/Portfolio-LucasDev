/*
 * Desenho das ondas em ASCII, usado tanto pelo worker quanto pelo fallback na
 * thread principal. A tela vira uma grade de caracteres e cada célula escolhe um
 * caractere da RAMP conforme a altura de um campo de ondas (soma de senos que
 * andam no tempo). Onde a onda é mais alta o caractere é mais denso e mais verde.
 * O mouse solta uma ondulação circular em volta do cursor.
 */
export const RAMP = ' .·:-=+*#%';
export const FPS = 24;

const CELL = 16;
const MAX_DPR = 1.5;
const LEVELS = RAMP.length;

export const PALETTE = {
  dark: { base: [163, 163, 163], accent: [0, 204, 85], maxAlpha: 0.18 },
  light: { base: [71, 85, 105], accent: [0, 134, 58], maxAlpha: 0.16 },
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

export function createAsciiRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const mouse = { col: 0, row: 0, active: false };
  let palette = PALETTE.dark;
  let stepX = CELL * 0.75;
  let offsetX = 0;
  let cols = 0;
  let rows = 0;
  let cells = new Uint8Array(0);
  let styles = [];

  const buildStyles = () => {
    const { base, accent, maxAlpha } = palette;
    styles = Array.from({ length: LEVELS }, (_, level) => {
      const k = level / (LEVELS - 1);
      const [r, g, b] = k > 0.6 ? accent : base;
      return `rgba(${r}, ${g}, ${b}, ${(0.25 + k * 0.75) * maxAlpha})`;
    });
  };
  buildStyles();

  const resize = (width, height, devicePixelRatio) => {
    const dpr = Math.min(devicePixelRatio || 1, MAX_DPR);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `${CELL - 4}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // fonte monoespaçada: com letterSpacing cada caractere ocupa exatamente uma
    // célula; sem suporte, a célula passa a ter a largura do caractere
    const advance = ctx.measureText('M').width;
    if ('letterSpacing' in ctx) {
      stepX = CELL * 0.75;
      ctx.letterSpacing = `${stepX - advance}px`;
      offsetX = (stepX - advance) / 2;
    } else {
      stepX = advance;
      offsetX = 0;
    }

    cols = Math.ceil(width / stepX);
    rows = Math.ceil(height / CELL);
    cells = new Uint8Array(cols);
  };

  /*
   * Em vez de desenhar caractere por caractere, cada linha vira um texto por tom
   * de cor (com espaços onde entram os outros tons) desenhado de uma vez.
   */
  const draw = (now) => {
    const t = now / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
      let present = 0;
      for (let col = 0; col < cols; col++) {
        const level = Math.floor(waveAt(col, row, t, mouse) * (LEVELS - 1) + 0.5);
        cells[col] = level;
        present |= 1 << level;
      }

      const y = row * CELL + CELL / 2;
      for (let level = 1; level < LEVELS; level++) {
        if (!(present & (1 << level))) continue;
        let line = '';
        for (let col = 0; col < cols; col++) line += cells[col] === level ? RAMP[level] : ' ';
        ctx.fillStyle = styles[level];
        ctx.fillText(line, offsetX, y);
      }
    }
  };

  const setPalette = (next) => {
    palette = next;
    buildStyles();
  };

  const setMouse = (x, y, active) => {
    mouse.col = x / stepX;
    mouse.row = y / CELL;
    mouse.active = active;
  };

  return { resize, draw, setPalette, setMouse };
}
