import styles from './About.module.css';
import { useLanguage } from '../../i18n/useLanguage';
import RichText from '../common/RichText';
import TypedText from '../effects/TypedText';
import useTilt from '../effects/useTilt';
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
 * Ícones animados do “Como eu trabalho”, no espírito dos mascotes das skills.
 * Cada um roda a sua animação uma vez quando o bloco aparece e de novo no hover.
 */

/* Lupa vasculhando até achar o bug, que mexe as perninhas quando é encontrado */
function IconCause() {
  return (
    <svg viewBox="0 0 48 48" className={`${styles.icon} ${styles.iconCause}`}>
      <g className={styles.bug}>
        <path className={styles.bugLegs} d="M14 24l-4-2M14 28h-5M14 32l-4 2M26 24l4-2M26 28h5M26 32l4 2" />
        <path className={styles.bugAntennae} d="M18 15l-2-4M22 15l2-4" />
        <circle className={styles.bugHead} cx="20" cy="18" r="3.5" />
        <ellipse className={styles.bugBody} cx="20" cy="28" rx="6" ry="8" />
        <path className={styles.bugLine} d="M20 21v15" />
      </g>
      <g className={styles.lens}>
        <circle className={styles.lensGlass} cx="28" cy="22" r="9" />
        <path className={styles.lensHandle} d="M34.5 28.5L42 36" />
      </g>
    </svg>
  );
}

/* Prancheta com checklist: os itens são marcados um a um */
function IconPlan() {
  return (
    <svg viewBox="0 0 48 48" className={`${styles.icon} ${styles.iconPlan}`}>
      <rect className={styles.board} x="10" y="8" width="28" height="35" rx="4" />
      <rect className={styles.clip} x="18" y="5" width="12" height="6" rx="2" />
      {[17, 25, 33].map((y, i) => (
        <g key={y} className={styles.task} style={{ '--t': i }}>
          <rect className={styles.taskBox} x="15" y={y} width="5" height="5" rx="1.2" />
          <path className={styles.taskCheck} d={`M16 ${y + 2.6}l1.4 1.4 2.8-3`} pathLength="1" />
          <path className={styles.taskLine} d={`M24 ${y + 2.5}h${i === 1 ? 7 : 10}`} pathLength="1" />
        </g>
      ))}
    </svg>
  );
}

/* Bússola: a agulha gira, hesita e para numa direção nova */
function IconRoute() {
  return (
    <svg viewBox="0 0 48 48" className={`${styles.icon} ${styles.iconRoute}`}>
      <circle className={styles.compass} cx="24" cy="24" r="17" />
      <path className={styles.compassTicks} d="M24 9v3M24 36v3M9 24h3M36 24h3" />
      <g className={styles.needle}>
        <path className={styles.needleNorth} d="M24 12l3.5 12h-7z" />
        <path className={styles.needleSouth} d="M24 36l3.5-12h-7z" />
      </g>
      <circle className={styles.compassPin} cx="24" cy="24" r="2" />
    </svg>
  );
}

/* Celular dormindo: ninguém precisou ligar */
function IconUser() {
  return (
    <svg viewBox="0 0 48 48" className={`${styles.icon} ${styles.iconUser}`}>
      <g className={styles.phone}>
        <rect className={styles.phoneBody} x="12" y="9" width="19" height="32" rx="4" />
        <path className={styles.phoneFace} d="M17 23q2 2 4 0M22.5 23q2 2 4 0M19.5 29q2 1.5 4 0" />
        <path className={styles.phoneSpeaker} d="M19.5 12.5h4" />
      </g>
      <text className={styles.zzz} x="33" y="20" style={{ '--z': 0 }}>z</text>
      <text className={styles.zzz} x="37" y="14" style={{ '--z': 1 }}>z</text>
      <text className={styles.zzz} x="41" y="8" style={{ '--z': 2 }}>z</text>
    </svg>
  );
}

const VALUE_ICONS = [IconCause, IconPlan, IconRoute, IconUser];

/* Card do “Como eu trabalho”: inclina seguindo o mouse, com brilho, como os cards de skills */
function ValueCard({ value, index }) {
  const tilt = useTilt(8);
  const Icon = VALUE_ICONS[index];

  return (
    <li
      ref={tilt.ref}
      className={styles.valueCard}
      style={{ '--delay': `${index * 110}ms` }}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      <span className={styles.valueGlare} aria-hidden="true" />
      <span className={styles.valueIcon} aria-hidden="true">
        {Icon && <Icon />}
      </span>
      <p className={styles.valueText}>
        <RichText text={value} />
      </p>
    </li>
  );
}

function ValuesBlock({ title, values }) {
  const [ref, inView] = useInView(0.2, { replay: true });
  return (
    <div ref={ref} className={`${styles.valuesBlock} ${inView ? styles.valuesRevealed : ''}`}>
      <h3 className={styles.valuesTitle}>{title}</h3>
      <ol className={styles.valuesGrid}>
        {values.map((value, i) => (
          <ValueCard key={value} value={value} index={i} />
        ))}
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