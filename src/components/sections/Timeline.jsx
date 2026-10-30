import { useEffect, useRef, useState } from 'react';
import styles from './Timeline.module.css';
import logoPucpr from '../../assets/pucpr.png';
import logoGobpr from '../../assets/GOBPR.jpg';
import { useLanguage } from '../../i18n/useLanguage';
import RichText, { KeywordLink } from '../common/RichText';

const TIMELINE = [
  { id: 'pucpr', type: 'education', logo: logoPucpr, ongoing: true },
  { id: 'gobpr', type: 'work', logo: logoGobpr, ongoing: true },
  { id: 'savepoint', type: 'project', projectId: 'ROW_03' },
  { id: 'python', type: 'course' },
  { id: 'skinomics', type: 'project', projectId: 'ROW_04', ongoing: true },
  { id: 'rotinas', type: 'project', projectId: 'ROW_01', ongoing: true },
  { id: 'hackathon', type: 'hackathon', projectId: 'ROW_02' },
];

function TimelineItem({ item, index }) {
  const { t } = useLanguage();
  const itemRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const content = t.timeline.items[item.id];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.15 }
    );
    observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);

  const side = index % 2 === 0 ? styles.left : styles.right;

  return (
    <li ref={itemRef} className={`${styles.item} ${side} ${isVisible ? styles.visible : ''}`}>
      <span className={`${styles.dot} ${item.ongoing ? styles.dotOngoing : ''}`} aria-hidden="true" />

      <article className={styles.card}>
        <div className={styles.cardTop}>
          <div className={styles.badges}>
            <span className={styles.typeBadge}>{t.timeline.types[item.type]}</span>
            {item.ongoing && <span className={styles.ongoing}>{t.timeline.ongoing}</span>}
          </div>
          <span className={styles.date}>{content.date}</span>
        </div>

        <div className={styles.heading}>
          {item.logo && <img src={item.logo} alt="" className={styles.logo} loading="lazy" decoding="async" />}
          <div>
            <h3 className={styles.title}>{content.title}</h3>
            <p className={styles.org}>{content.org}</p>
          </div>
        </div>

        <p className={styles.description}>
          <RichText text={content.description} />
        </p>

        {content.highlights && (
          <ul className={styles.highlights}>
            {content.highlights.map((highlight) => (
              <li key={highlight} className={styles.highlight}>
                <RichText text={highlight} />
              </li>
            ))}
          </ul>
        )}

        <div className={styles.footer}>
          <div className={styles.tags}>
            {content.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>

          {item.projectId && (
            <KeywordLink href={`#project-${item.projectId}`} className={styles.projectLink}>
              {t.timeline.viewProject} →
            </KeywordLink>
          )}
        </div>
      </article>
    </li>
  );
}

export default function Timeline() {
  const { t } = useLanguage();

  return (
    <section id="journey" className={styles.sectionContainer}>
      <div className={styles.header}>
        <span className={styles.tagline}>SELECT * FROM journey ORDER BY date;</span>
        <h2 className={styles.sectionTitle}>{t.timeline.title}</h2>
        <p className={styles.subtitle}>{t.timeline.subtitle}</p>
      </div>

      <ol className={styles.timeline}>
        {TIMELINE.map((item, index) => (
          <TimelineItem key={item.id} item={item} index={index} />
        ))}
      </ol>
    </section>
  );
}
