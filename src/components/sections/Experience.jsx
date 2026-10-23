import styles from "./Experience.module.css";

import fotoPerfil from "../../assets/GOBPR.jpg";

const EXPERIENCES = [
  {
    id: "ROW_01",
    role: "Estagiário de TI",
    company: "Grande Oriente do Brasil - Paraná",
    period: "Out/2025 - Atualmente",
    description:
      "Entrei no suporte e na automação de planilhas e hoje desenvolvo o sistema interno que documenta as rotinas de trabalho de todas as secretarias, construído em Python/Django sobre os requisitos das normas ISO 9001 e ISO 37001.",
    activities: [
      "Desenvolvimento do Sistema de Rotinas: cadastro, versionamento, fluxo de aprovação e mapa visual de cada processo, com versão para impressão;",
      "Tradução dos requisitos da ISO 9001 e da ISO 37001 em regras do sistema: controle de documentos, histórico de versões, acesso por secretaria e autenticação em dois fatores;",
      "Automação de etapas repetitivas de processos administrativos com planilhas e scripts, reduzindo preenchimento manual e retrabalho;",
      "Desenvolvimento e manutenção de páginas web internas;",
      "Suporte aos usuários e ajuste das ferramentas a partir do uso real da equipe.",
    ],
    technologies: [
      "Python",
      "Django",
      "ISO 9001",
      "ISO 37001",
      "Automação",
      "Excel",
      "Suporte",
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience" className={styles.sectionContainer}>
      <div className={styles.header}>
        <span className={styles.tagline}>SELECT * FROM experience;</span>

        <h2 className={styles.sectionTitle}>
          Experiência Profissional
        </h2>
      </div>

      <div className={styles.experienceList}>
        {EXPERIENCES.map((experience) => (
          <div key={experience.id} className={styles.experienceCard}>
            <div className={styles.experienceHeader}>
              <div className={styles.company}>
                <div className={styles.logo}>
                  <img
                    src={fotoPerfil}
                    alt={experience.company}
                  />
                </div>

                <div className={styles.info}>
                  <div className={styles.roleContainer}>
                    <span className={styles.experienceId}>
                      {experience.id}
                    </span>

                    <h3 className={styles.role}>
                      {experience.role}
                    </h3>
                  </div>

                  <h4 className={styles.companyName}>
                    {experience.company}
                  </h4>

                  <span className={styles.period}>
                    {experience.period}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.divider} />

            <p className={styles.description}>
              {experience.description}
            </p>

            <h5 className={styles.activitiesTitle}>
              Principais atividades
            </h5>

            <div className={styles.activities}>
              {experience.activities.map((activity) => (
                <div
                  key={activity}
                  className={styles.activity}
                >
                  {activity}
                </div>
              ))}
            </div>

            <div className={styles.technologies}>
              {experience.technologies.map((technology) => (
                <span
                  key={technology}
                  className={styles.technology}
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;

