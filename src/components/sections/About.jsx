import { useEffect, useRef } from 'react';
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


/*
 * Divide a frase em duas partes: o começo (até a primeira vírgula ou dois-pontos),
 * que fica em destaque, e o resto. Cada palavra vira um <span> com o seu índice.
 */
function splitWords(text) {
  const cut = text.search(/[,:]/);
  const lead = cut === -1 ? text : text.slice(0, cut + 1);
  const rest = cut === -1 ? '' : text.slice(cut + 1);
  const words = [
    ...lead.split(' ').filter(Boolean).map((word) => ({ word, lead: true })),
    ...rest.split(' ').filter(Boolean).map((word) => ({ word, lead: false })),
  ];
  return words;
}

/*
 * Como eu trabalho: cada princípio é uma frase grande numa linha, separada por
 * um fio. As palavras começam apagadas e acendem uma a uma conforme a linha sobe
 * na tela (--p vai de 0 a 1 com o scroll).
 */
function ValuesBlock({ title, values }) {
  const listRef = useRef(null);

  useEffect(() => {
    const rows = [...listRef.current.children];
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      rows.forEach((row) => {
        const { top } = row.getBoundingClientRect();
        const progress = (vh * 0.9 - top) / (vh * 0.45);
        row.style.setProperty('--p', Math.min(Math.max(progress, 0), 1).toFixed(3));
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [values]);

  return (
    <div className={styles.valuesBlock}>
      <h3 className={styles.valuesTitle}>{title}</h3>
      <ol ref={listRef} className={styles.valuesList}>
        {values.map((value, i) => {
          const words = splitWords(value);
          return (
            <li key={value} className={styles.valueRow} style={{ '--n': words.length }}>
              <span className={styles.valueIndex}>{String(i + 1).padStart(2, '0')}</span>
              <p className={styles.valueSentence} aria-label={value}>
                {words.map(({ word, lead }, w) => (
                  <span
                    key={w}
                    aria-hidden="true"
                    className={lead ? styles.wordLead : styles.word}
                    style={{ '--w': w }}
                  >
                    {word}{' '}
                  </span>
                ))}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
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

      <ValuesBlock title={t.about.valuesTitle} values={t.about.values} />
    </section>
  );
}