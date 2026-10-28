import styles from './About.module.css';
import { useLanguage } from '../../i18n/useLanguage';
import RichText from '../common/RichText';
import TypedText from '../effects/TypedText';
import useInView from '../effects/useInView';
import useTypingProgress, { tokensLength } from '../effects/useTypingProgress';

function ProfileRecord({ facts }) {
  const [cardRef, inView] = useInView(0.3);

  const rows = facts.map((fact) => [
    { text: `"${fact.key}"`, className: styles.factKey },
    { text: ':', className: styles.colon },
    { text: `"${fact.value}"`, className: styles.factValue },
  ]);
  const total = rows.reduce((sum, tokens) => sum + tokensLength(tokens), 0);
  const typed = useTypingProgress(total, { active: inView, startDelay: 400, charDelay: 18 });
  const isDone = typed >= total;

  let offset = 0;

  return (
    <aside ref={cardRef} className={styles.factsCard}>
      <div className={styles.factsHeader}>
        <span className={styles.factsFile}>profile_record.json</span>
      </div>

      <p className="sr-only">{facts.map((fact) => `${fact.key}: ${fact.value}`).join(', ')}</p>

      <div className={styles.factsBody} aria-hidden="true">
        <span className={styles.brace}>{'{'}</span>
        {rows.map((tokens, i) => {
          const rowOffset = offset;
          offset += tokensLength(tokens);
          return (
            <div key={facts[i].key} className={styles.factRow}>
              <TypedText tokens={tokens} typed={typed} offset={rowOffset} showCaret={!isDone} />
            </div>
          );
        })}
        <span className={`${styles.brace} ${isDone ? '' : styles.pending}`}>{'}'}</span>
      </div>
    </aside>
  );
}

export default function About() {
  const { lang, t } = useLanguage();

  return (
    <section id="about" className={styles.sectionContainer}>
      <div className={styles.header}>
        <span className={styles.tagline}>SELECT * FROM about_me;</span>
        <h2 className={styles.sectionTitle}>{t.about.title}</h2>
      </div>

      <div className={styles.layout}>
        <div className={styles.textColumn}>
          <p className={styles.lead}>
            <RichText text={t.about.lead} />
          </p>

          {t.about.paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
        </div>

        <ProfileRecord key={lang} facts={t.about.facts} />
      </div>

      <div className={styles.valuesBlock}>
        <h3 className={styles.valuesTitle}>{t.about.valuesTitle}</h3>
        <ol className={styles.valuesGrid}>
          {t.about.values.map((value, i) => (
            <li key={value} className={styles.valueCard}>
              <span className={styles.valueNumber}>{String(i + 1).padStart(2, '0')}</span>
              <p className={styles.valueText}>
                <RichText text={value} />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}