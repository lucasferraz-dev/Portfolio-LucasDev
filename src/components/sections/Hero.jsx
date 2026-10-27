import { useEffect, useState } from 'react';
import styles from './Hero.module.css';
import fotoPerfil from '../../assets/perfil.jpg'
import { useLanguage } from '../../i18n/useLanguage';
import ParticleSphere from '../effects/ParticleSphere';
import Typewriter from '../effects/Typewriter';
import TypedText from '../effects/TypedText';
import useInView from '../effects/useInView';
import useTypingProgress, { tokensLength } from '../effects/useTypingProgress';
import RichText from '../common/RichText';

const QUERY_TOKENS = [
  { text: 'SELECT', className: styles.keyword },
  { text: ' name, role, focus ' },
  { text: 'FROM', className: styles.keyword },
  { text: ' developers ' },
  { text: 'WHERE', className: styles.keyword },
  { text: ' id = ' },
  { text: "'lucas_ferraz'", className: styles.string },
  { text: ';' },
];

const QUERY_TEXT = QUERY_TOKENS.map((token) => token.text).join('');
const QUERY_LENGTH = tokensLength(QUERY_TOKENS);
const EXECUTE_DELAY = 700;
const ROW_DELAY = 220;

function DeveloperQuery({ role }) {
  const [cardRef, inView] = useInView();
  const typed = useTypingProgress(QUERY_LENGTH, { active: inView });
  const [revealed, setRevealed] = useState(0);

  const results = [
    ['Name', 'Lucas Ferraz dos Santos'],
    ['Role', role],
    ['Focus', 'Python · Django · React'],
  ];
  const totalSteps = results.length + 1;
  const isTyping = typed < QUERY_LENGTH;
  const isDone = revealed >= totalSteps;

  useEffect(() => {
    if (isTyping || isDone) return;
    const timer = setTimeout(() => setRevealed((n) => n + 1), revealed === 0 ? EXECUTE_DELAY : ROW_DELAY);
    return () => clearTimeout(timer);
  }, [isTyping, isDone, revealed]);

  const queryParts = <TypedText tokens={QUERY_TOKENS} typed={typed} showCaret={isTyping} />;

  const lineClass = (step) => `${styles.dbLine} ${revealed > step ? '' : styles.pending}`;

  return (
    <div ref={cardRef} className={styles.dbStatusCard}>
      <div className={styles.dbHeader}>
        <span className={styles.dbTitle}>developer_query.sql</span>
      </div>

      <p className="sr-only">
        {QUERY_TEXT} {results.map(([label, value]) => `${label}: ${value}`).join(', ')}
      </p>

      <div className={styles.dbContent} aria-hidden="true">
        <div className={styles.dbLine}>
          <span className={styles.prompt}>mysql&gt;</span>
          {queryParts}
        </div>

        <div className={styles.dbResult}>
          {results.map(([label, value], i) => (
            <div key={label} className={lineClass(i)}>
              <span className={styles.output}>&gt; {label}:</span> <span className={styles.string}>'{value}'</span>
            </div>
          ))}
          <div className={`${lineClass(results.length)} ${styles.dbFooter}`}>1 row in set (0.01 sec)</div>
        </div>

        <div className={`${styles.dbLine} ${isDone ? '' : styles.pending}`}>
          <span className={styles.prompt}>mysql&gt;</span>
          <span className={styles.caret} />
        </div>
      </div>
    </div>
  );
}

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
          <RichText text={t.hero.description} />
        </p>

        <div className={styles.ctaGroup}>
          <a href="#projects" className={styles.primaryBtn}>
            {t.hero.ctaProjects}
          </a>
          <a href={t.hero.resumeFile} target="_blank" rel="noreferrer" className={styles.secondaryBtn}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.btnIcon}>
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
            </svg>
            {t.hero.ctaResume}
          </a>
          <a href="#contact" className={styles.secondaryBtn}>
            {t.hero.ctaContact}
          </a>
        </div>
      </div>

      <div className={styles.visualContainer}>
        <div className={styles.photoFrame}>
          <img src={fotoPerfil} alt="Lucas Ferraz dos Santos" className={styles.profilePhoto} fetchPriority="high" />
        </div>
        
        <DeveloperQuery role={t.hero.role} />
      </div>

    </section>
  );
}