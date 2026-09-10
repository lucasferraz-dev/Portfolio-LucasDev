import styles from "./Experience.module.css";

import fotoPerfil from "../../assets/GOBPR.jpg";

const EXPERIENCES = [
  {
    id: "ROW_01",
    role: "Estagiário de TI",
    company: "Grande Oriente do Brasil - Paraná",
    period: "Out/2025 - Atualmente",
    description:
      "Atuação em Tecnologia da Informação, desenvolvendo e automatizando soluções para processos internos, além de prestar suporte aos usuários e auxiliar na manutenção de sistemas e páginas web.",
    activities: [
      "Automação de processos utilizando planilhas e ferramentas digitais;",
      "Desenvolvimento e manutenção de páginas web para processos internos;",
      "Organização e manipulação de dados utilizados em processos administrativos;",
    ],
    technologies: [
      "Excel",
      "Automação",
      "Web",
      "Banco de Dados",
      "Suporte",
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience" className={styles.sectionContainer}>
      <div className={styles.header}>
        <span className={styles.tagline}>Execute query_Experience</span>

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

