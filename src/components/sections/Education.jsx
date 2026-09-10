import styles from './Education.module.css';
import logoPucpr from '../../assets/pucpr.png';

const EDUCATION = [
  {
    id: 'EDU_01',
    degree: 'Bacharelado em Ciência da Computação',
    institution: 'PUCPR - Pontifícia Universidade Católica do Paraná',
    period: '2024 - 2027 (em andamento)',
    status: 'IN_PROGRESS',
    logo: logoPucpr,
    highlights: [
      'Desenvolvimento de software e programação orientada a objetos;',
      'Banco de dados, desenvolvimento web e arquitetura de sistemas;',
      'Inteligência Artificial, Machine Learning e programação distribuída.',
    ],
  },
];

const CERTIFICATIONS = [
  { name: 'Ciência da Computação / Bacharelado', issuer: 'PUCPR - Pontificia Universidade Católica do Paraná', year: '2027' },
  { name: 'Curso de Python 3 do básico ao avançado - com projetos reais', issuer: 'Udemy', year: '2026' },
];

export default function Education() {
  return (
    <section id="education" className={styles.sectionContainer}>
      <div className={styles.header}>
        <span className={styles.tagline}>SELECT * FROM education;</span>
        <h2 className={styles.sectionTitle}>Formação</h2>
      </div>

      <div className={styles.list}>
        {EDUCATION.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.institutionBlock}>
                <div className={styles.logo}>
                  {item.logo ? (
                    <img src={item.logo} alt={`Logo ${item.institution}`} />
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
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {CERTIFICATIONS.length > 0 && (
        <div className={styles.certBlock}>
          <h3 className={styles.certTitle}>Cursos e certificações</h3>
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