import { useState, useEffect } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.headerContainer} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navWrapper}>
        <a href="#" className={styles.logo}>
          <span className={styles.logoPrefix}>&lt;</span>
          Lucas Ferraz
          <span className={styles.logoSuffix}> /&gt;</span>
        </a>

        <nav className={styles.navbar}>
          <a href="#" className={styles.navLink}>
            <span className={styles.linkLine}>//</span> Sobre
          </a>
          <a href="#skills" className={styles.navLink}>
            <span className={styles.linkLine}>//</span> Skills
          </a>
          <a href="#projects" className={styles.navLink}>
            <span className={styles.linkLine}>//</span> Projetos
          </a>
          <a href="#contact" className={styles.navLink}>
            <span className={styles.linkLine}>//</span> Contato
          </a>
        </nav>

      </div>
    </header>
  );
}