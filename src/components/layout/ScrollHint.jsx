import { useEffect, useState } from 'react';
import styles from './ScrollHint.module.css';
import { useLanguage } from '../../i18n/useLanguage';

const HIDE_AFTER = 80;

export default function ScrollHint() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY < HIDE_AFTER);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href="#about"
      className={`${styles.hint} ${isVisible ? '' : styles.faded}`}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <span className={styles.inner}>
        <span className={styles.mouse} aria-hidden="true">
          <span className={styles.wheel} />
        </span>
        <span className={styles.label}>{t.hero.scrollHint}</span>
        <span className={styles.arrow} aria-hidden="true">↓</span>
      </span>
    </a>
  );
}
