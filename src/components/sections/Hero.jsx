import styles from './Hero.module.css';
import fotoPerfil from '../../assets/perfil.jpg'
import { useLanguage } from '../../i18n/useLanguage';
import ParticleSphere from '../effects/ParticleSphere';
import Typewriter from '../effects/Typewriter';

export default function Hero() {
  const { lang, t } = useLanguage();

  return (
    <section className={styles.heroContainer}>
      <ParticleSphere className={styles.particles} />

      <div className={styles.textBlock}>
        <div className={styles.tagline}>
          // SOFTWARE DEVELOPMENT & PROBLEM SOLVING \\
        </div>
        
        <h1 className={styles.title}>
          Lucas Ferraz dos Santos
        </h1>

        <p className={styles.typed}>
          <span className={styles.typedPrompt}>&gt;</span> {t.hero.typedPrefix}{' '}
          <Typewriter
            key={lang}
            phrases={t.hero.typedPhrases}
            className={styles.typedWord}
            cursorClassName={styles.cursor}
          />
        </p>

        <h2 className={styles.subtitle}>
          {t.hero.subtitle}
        </h2>

        <p className={styles.description}>
          {t.hero.description}
        </p>

        <div className={styles.ctaGroup}>
          <a href="#projects" className={styles.primaryBtn}>
            {t.hero.ctaProjects}
          </a>
          <a href="#contact" className={styles.secondaryBtn}>
            {t.hero.ctaContact}
          </a>
        </div>
      </div>

      <div className={styles.visualContainer}>
        <div className={styles.photoFrame}>
          <img src={fotoPerfil} alt="Lucas Ferraz dos Santos" className={styles.profilePhoto} />
        </div>
        
        <div className={styles.dbStatusCard}>
          <div className={styles.dbHeader}>
            <span className={styles.dbTitle}>developer_query.sql</span>
          </div>
          <div className={styles.dbContent}>
            <div className={styles.dbLine}>
              <span className={styles.keyword}>SELECT</span> name, role, focus <span className={styles.keyword}>FROM</span> developers <span className={styles.keyword}>WHERE</span> id = <span className={styles.string}>'lucas_ferraz'</span>;
            </div>
            <div className={styles.dbResult}>
              <div className={styles.dbLine}>
                <span className={styles.output}>&gt; Name:</span> <span className={styles.string}>'Lucas Ferraz dos Santos'</span>
              </div>
              <div className={styles.dbLine}>
                <span className={styles.output}>&gt; Role:</span> <span className={styles.string}>'{t.hero.role}'</span>
              </div>
              <div className={styles.dbLine}>
                <span className={styles.output}>&gt; Focus:</span> <span className={styles.string}>'Python · Django · React'</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}