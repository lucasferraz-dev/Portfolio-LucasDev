import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Tour.module.css';
import { useLanguage } from '../../i18n/useLanguage';

/* o que cada passo destaca, na mesma ordem dos textos em t.tour.steps */
const TARGETS = [
  '[data-tour="logo"]',
  '[data-tour="lang"]',
  '[data-tour="theme"]',
  '[data-tour="fullscreen"]',
  '[data-tour="tv"]',
  '#about',
  '#projects',
  '#skills',
  '#journey',
  '#contact',
];

const PAD = 8;
const MARGIN = 12;
const CARD_WIDTH = 340;

/* retângulo do alvo, com folga e cortado nas bordas da tela */
function measure(el) {
  const r = el.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const top = Math.max(r.top - PAD, MARGIN);
  const left = Math.max(r.left - PAD, MARGIN);
  const bottom = Math.min(r.bottom + PAD, vh - MARGIN);
  const right = Math.min(r.right + PAD, vw - MARGIN);
  return { top, left, width: Math.max(right - left, 0), height: Math.max(bottom - top, 0) };
}

/*
 * Tour guiado: escurece a página e deixa claro só um retângulo em volta do que
 * está sendo explicado (uma sombra gigante em volta do recorte), com um balão de
 * texto ao lado. Setas do teclado navegam e Esc fecha. Passos cujo alvo não
 * existe (como a tela cheia no iPhone) são pulados.
 */
export default function Tour({ onClose }) {
  const { t } = useLanguage();
  const steps = t.tour.steps
    .map((step, i) => ({ ...step, target: TARGETS[i] }))
    .filter((step) => document.querySelector(step.target));

  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const [cardHeight, setCardHeight] = useState(0);
  const cardRef = useRef(null);
  const nextRef = useRef(null);
  const step = steps[index];
  const isLast = index === steps.length - 1;

  const next = useCallback(() => {
    if (isLast) onClose();
    else setIndex((i) => i + 1);
  }, [isLast, onClose]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  // leva o alvo para a tela e acompanha a posição dele enquanto a página rola
  useEffect(() => {
    const el = document.querySelector(step.target);
    if (!el) return undefined;

    if (step.target.startsWith('#')) el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    let frame = 0;
    const update = () => {
      frame = 0;
      setRect(measure(el));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    // durante a rolagem suave o alvo ainda está se movendo
    const follow = setInterval(update, 60);
    const stopFollow = setTimeout(() => clearInterval(follow), 1200);

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(follow);
      clearTimeout(stopFollow);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [step.target]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight') next();
      else if (event.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onClose]);

  useEffect(() => {
    nextRef.current?.focus({ preventScroll: true });
  }, [index]);

  useLayoutEffect(() => {
    if (cardRef.current) setCardHeight(cardRef.current.offsetHeight);
  }, [index, t]);

  if (!step) return null;

  // balão embaixo do alvo, ou em cima; se o alvo ocupa a tela, fica preso embaixo
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let cardStyle = { left: '50%', bottom: 24, transform: 'translateX(-50%)' };
  if (rect) {
    const left = Math.min(Math.max(rect.left, 16), vw - CARD_WIDTH - 16);
    if (rect.top + rect.height + MARGIN + cardHeight < vh - 16) {
      cardStyle = { left, top: rect.top + rect.height + MARGIN };
    } else if (rect.top - MARGIN - cardHeight > 16) {
      cardStyle = { left, top: rect.top - MARGIN - cardHeight };
    }
  }

  return createPortal(
    <div className={styles.tour} role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className={styles.blocker} onClick={onClose} />
      {rect && <div className={styles.spotlight} style={rect} />}

      <div ref={cardRef} className={styles.card} style={cardStyle}>
        <div className={styles.cardTop}>
          <span className={styles.counter}>
            {index + 1} / {steps.length}
          </span>
          <button type="button" className={styles.skip} onClick={onClose}>
            {t.tour.skip}
          </button>
        </div>

        <h2 id="tour-title" className={styles.title}>{step.title}</h2>
        <p className={styles.text}>{step.text}</p>

        <div className={styles.dots} aria-hidden="true">
          {steps.map((s, i) => (
            <span key={s.target} className={`${styles.dot} ${i === index ? styles.dotActive : ''}`} />
          ))}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.prev} onClick={prev} disabled={index === 0}>
            {t.tour.prev}
          </button>
          <button ref={nextRef} type="button" className={styles.next} onClick={next}>
            {isLast ? t.tour.done : t.tour.next}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
