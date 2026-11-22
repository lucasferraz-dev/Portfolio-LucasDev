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
 * Ícones do “Como eu trabalho”, um para cada princípio. Os traços usam
 * pathLength="1" para serem desenhados (dashoffset 1 → 0) quando o bloco
 * aparece; no hover cada um faz a sua animação.
 */
const VALUE_ICONS = [
  // lupa: procura a causa
  <g key="cause" className={styles.iconCause}>
    <circle cx="10" cy="10" r="6" pathLength="1" />
    <path d="M14.5 14.5L20 20" pathLength="1" />
  </g>,
  // árvore de tarefas (EAP): planejar antes
  <g key="plan" className={styles.iconPlan}>
    <rect x="9" y="3" width="6" height="4" rx="1" pathLength="1" />
    <path d="M12 7v4M5 11h14M5 11v3M12 11v3M19 11v3" pathLength="1" />
    <rect x="3" y="14" width="4" height="4" rx="1" pathLength="1" />
    <rect x="10" y="14" width="4" height="4" rx="1" pathLength="1" />
    <rect x="17" y="14" width="4" height="4" rx="1" pathLength="1" />
  </g>,
  // caminho que muda de direção: mudar de rota
  <g key="route" className={styles.iconRoute}>
    <path d="M5 21V5" pathLength="1" className={styles.iconFaded} />
    <path d="M5 21v-7a5 5 0 0 1 5-5h9" pathLength="1" />
    <path d="M16 6l3 3-3 3" pathLength="1" />
  </g>,
  // pessoa com um check: feito para quem usa
  <g key="user" className={styles.iconUser}>
    <circle cx="9" cy="8" r="3.5" pathLength="1" />
    <path d="M3 20a6 6 0 0 1 12 0" pathLength="1" />
    <path d="M15.5 12.5l2 2 4-4" pathLength="1" />
  </g>,
];

/* Um princípio: ícone, título e texto, com um brilho que acompanha o mouse */
function ValueItem({ value, index }) {
  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--gx', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--gy', `${event.clientY - rect.top}px`);
  };

  return (
    <li className={styles.valueItem} style={{ '--i': index }} onPointerMove={handlePointerMove}>
      <span className={styles.valueGlow} aria-hidden="true" />
      <span className={styles.valueDot} aria-hidden="true" />
      <span className={styles.valueNumber} aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className={styles.valueIcon} aria-hidden="true">
        <svg viewBox="0 0 24 24">{VALUE_ICONS[index]}</svg>
      </span>

      <h4 className={styles.valueTitle}>{value.title}</h4>
      <p className={styles.valueText}>
        <RichText text={value.text} />
      </p>
    </li>
  );
}

/*
 * Os quatro princípios lado a lado, sem caixas. Quando o bloco aparece, a linha
 * de cima se desenha da esquerda para a direita, as bolinhas acendem em
 * sequência e cada item sobe com o ícone sendo desenhado.
 */
function ValuesBlock({ title, values }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div ref={ref} className={`${styles.valuesBlock} ${inView ? styles.valuesRevealed : ''}`}>
      <h3 className={styles.valuesTitle}>{title}</h3>
      <ol className={styles.valuesGrid}>
        {values.map((value, i) => (
          <ValueItem key={value.title} value={value} index={i} />
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