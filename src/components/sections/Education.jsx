import styles from './Education.module.css';
import logoPucpr from '../../assets/pucpr.png';
import { useLanguage } from '../../i18n/useLanguage';
import RichText from '../common/RichText';

const EDUCATION = [
  {
    id: 'EDU_01',
    status: 'IN_PROGRESS',
    logo: logoPucpr,
  },
];

const CERTIFICATIONS = [
  { name: 'Curso de Python 3 do básico ao avançado - com projetos reais', issuer: 'Udemy', year: '2026' },
];

export default function Education() {
  const { t } = useLanguage();

  const education = EDUCATION.map((item) => ({
    ...item,
    ...t.education.items[item.id],
  }));

  return (
    <section id="education" className={styles.sectionContainer}>
      <div className={styles.header}>
        <span className={styles.tagline}>SELECT * FROM education;</span>
        <h2 className={styles.sectionTitle}>{t.education.title}</h2>
      </div>

      <div className={styles.list}>
        {education.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.institutionBlock}>
                <div className={styles.logo}>
                  {item.logo ? (
                    <img src={item.logo} alt={t.education.logoAlt(item.institution)} />
                  ) : (
                    <span className={styles.logoFallback}>EDU</span>
                  )}
                </div>

                <div className={styles.info}>
                  <div className={styles.degreeContainer}>
                    <span className={styles.rowId}>{item.id}</span>
                    <h3 className={styles.degree}>{item.degree}</h3>
                  </div>

                  <h4 className={styles.institution}>{item.institution}</h4>
                  <span className={styles.period}>{item.period}</span>
                </div>
              </div>

              <span className={styles.status}>{item.status}</span>
            </div>

            <div className={styles.divider} />

            <ul className={styles.highlights}>
              {item.highlights.map((h) => (
                <li key={h} className={styles.highlight}>
                  <span className={styles.bullet}>&gt;</span>
                  <RichText text={h} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {CERTIFICATIONS.length > 0 && (
        <div className={styles.certBlock}>
          <h3 className={styles.certTitle}>{t.education.certTitle}</h3>
          <div className={styles.certGrid}>
            {CERTIFICATIONS.map((cert) => (
              <div key={cert.name} className={styles.certCard}>
                <span className={styles.certName}>{cert.name}</span>
                <span className={styles.certMeta}>
                  {cert.issuer} • {cert.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}