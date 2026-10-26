import styles from './About.module.css';
import { useLanguage } from '../../i18n/useLanguage';

export default function About() {
  const { t } = useLanguage();
  const FACTS = t.about.facts;

  return (
    <section id="about" className={styles.sectionContainer}>
      <div className={styles.header}>
        <span className={styles.tagline}>SELECT * FROM about_me;</span>
        <h2 className={styles.sectionTitle}>{t.about.title}</h2>
      </div>

      <div className={styles.layout}>
        <div className={styles.textColumn}>
          <p className={styles.lead}>
            {t.about.lead}
          </p>

          {t.about.paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}

          <div className={styles.valuesBlock}>
            <h3 className={styles.valuesTitle}>{t.about.valuesTitle}</h3>
            <ul className={styles.valuesList}>
              {t.about.values.map((value) => (
                <li key={value} className={styles.valueItem}>
                  <span className={styles.bullet}>&gt;</span>
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className={styles.factsCard}>
          <div className={styles.factsHeader}>
            <span className={styles.factsFile}>profile_record.json</span>
          </div>
          <div className={styles.factsBody}>
            <span className={styles.brace}>{'{'}</span>
            {FACTS.map((fact) => (
              <div key={fact.key} className={styles.factRow}>
                <span className={styles.factKey}>&quot;{fact.key}&quot;</span>
                <span className={styles.colon}>:</span>
                <span className={styles.factValue}>&quot;{fact.value}&quot;</span>
              </div>
            ))}
            <span className={styles.brace}>{'}'}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}