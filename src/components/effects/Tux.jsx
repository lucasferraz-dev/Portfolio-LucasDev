import { useEffect, useRef, useState } from 'react';
import styles from './Tux.module.css';
import { useLanguage } from '../../i18n/useLanguage';
import TuxSprite from './TuxSprite';

/*
 * Tux sentado na borda de cima do terminal do contato, sempre olhando para
 * quem está vendo. Parado, ele balança os pés, pisca e de vez em quando acena. Ao clicar, dá um
 * pulinho e solta um balão com uma frase aleatória (sem repetir a anterior).
 */
export default function Tux({ className = '' }) {
  const { t } = useLanguage();
  const lines = t.fun.tuxLines;
  const [line, setLine] = useState(null);
  const [hops, setHops] = useState(0);
  const lastIndex = useRef(-1);

  useEffect(() => {
    if (line === null) return undefined;
    const timer = setTimeout(() => setLine(null), 3200);
    return () => clearTimeout(timer);
  }, [line, hops]);

  const poke = () => {
    let index = Math.floor(Math.random() * lines.length);
    if (index === lastIndex.current) index = (index + 1) % lines.length;
    lastIndex.current = index;
    setLine(lines[index]);
    setHops((n) => n + 1);
  };

  return (
    <div className={`${styles.wrapper} ${className}`} data-tour="tux">
      {line !== null && (
        <span key={hops} className={styles.bubble} role="status">
          {line}
        </span>
      )}

      <button type="button" className={styles.button} onClick={poke} aria-label={t.fun.tuxLabel} title={t.fun.tuxLabel}>
        <span key={hops} className={`${styles.tux} ${hops ? styles.hop : ''}`}>
          <TuxSprite mode="sit" front />
        </span>
      </button>
    </div>
  );
}
