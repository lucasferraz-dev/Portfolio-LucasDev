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
import TerminalWindow from '../common/TerminalWindow';

const QUERY_TOKENS = [
  { text: 'SELECT', className: styles.keyword },
  { text: ' name, role, focus ' },
  { text: 'FROM', className: styles.keyword },
  { text: ' developers ' },
  { text: 'WHERE', className: styles.keyword },
  { text: ' id = ' },
  { text: "'lucas_ferraz'", className: styles.string },
  { text: '\\G', className: styles.keyword },
];

const QUERY_TEXT = QUERY_TOKENS.map((token) => token.text).join('');
const QUERY_LENGTH = tokensLength(QUERY_TOKENS);
const EXECUTE_DELAY = 700;
const ROW_DELAY = 220;

/*
 * Terminal do MySQL: digita a consulta e mostra o resultado no formato vertical
 * do \G (a linha de “1. row” e os campos alinhados pela direita), como o cliente
 * de verdade. A barra de status mostra a conexão e o que está acontecendo.
 */
function DeveloperQuery({ role }) {
  const { t } = useLanguage();
  const [cardRef, inView] = useInView();
  const typed = useTypingProgress(QUERY_LENGTH, { active: inView });
  const [revealed, setRevealed] = useState(0);

  const results = [
    ['name', 'Lucas Ferraz dos Santos'],
    ['role', role],
    ['focus', 'Python · Django · React'],
  ];
  const keyWidth = Math.max(...results.map(([key]) => key.length));
  const totalSteps = results.length + 2;
  const isTyping = typed < QUERY_LENGTH;
  const isDone = revealed >= totalSteps;

  useEffect(() => {
    if (isTyping || isDone) return;
    const timer = setTimeout(() => setRevealed((n) => n + 1), revealed === 0 ? EXECUTE_DELAY : ROW_DELAY);
    return () => clearTimeout(timer);
  }, [isTyping, isDone, revealed]);

  const lineClass = (step, extra = '') => `${styles.line} ${extra} ${revealed > step ? '' : styles.pending}`;
  const status = isTyping ? t.hero.terminal.typing : isDone ? '0.01 sec' : t.hero.terminal.running;

  return (
    <TerminalWindow
      ref={cardRef}
      title="developer_query.sql"
      app="mysql 8.0"
      status={t.hero.terminal.connected}
      statusRight={status}
      bodyClassName={styles.query}
    >
      <p className="sr-only">
        {QUERY_TEXT} {results.map(([label, value]) => `${label}: ${value}`).join(', ')}
      </p>

      <div aria-hidden="true">
        <div className={styles.line}>
          <span className={styles.prompt}>mysql&gt;</span>
          <TypedText tokens={QUERY_TOKENS} typed={typed} showCaret={isTyping} />
        </div>

        <div className={lineClass(0, styles.rowSep)}>*************** 1. row ***************</div>
        {results.map(([key, value], i) => (
          <div key={key} className={lineClass(i + 1, styles.field)}>
            <span className={styles.fieldKey}>{key.padStart(keyWidth, ' ')}:</span>{' '}
            <span className={styles.fieldValue}>{value}</span>
          </div>
        ))}
        <div className={lineClass(results.length + 1, styles.footer)}>1 row in set (0.01 sec)</div>

        <div className={`${styles.line} ${styles.nextPrompt} ${isDone ? '' : styles.pending}`}>
          <span className={styles.prompt}>mysql&gt;</span>
          <span className={styles.caret} />
        </div>
      </div>
    </TerminalWindow>
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
        {/* moldura sem corte em volta da foto, onde as figurinhas colam */}
        <div className={styles.photoWrap} data-sticky="profile-photo">
          <div className={styles.photoFrame}>
            <img src={fotoPerfil} alt="Lucas Ferraz dos Santos" className={styles.profilePhoto} fetchPriority="high" />
          </div>
        </div>
        
        <DeveloperQuery role={t.hero.role} />
      </div>

    </section>
  );
}