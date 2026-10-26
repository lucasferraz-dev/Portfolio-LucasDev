import styles from "./Experience.module.css";

import fotoPerfil from "../../assets/GOBPR.jpg";
import { useLanguage } from "../../i18n/useLanguage";

const EXPERIENCES = [
  {
    id: "ROW_01",
    company: "Grande Oriente do Brasil - Paraná",
  },
];

const Experience = () => {
  const { t } = useLanguage();

  const experiences = EXPERIENCES.map((experience) => ({
    ...experience,
    ...t.experience.items[experience.id],
  }));

  return (
    <section id="experience" className={styles.sectionContainer}>
      <div className={styles.header}>
        <span className={styles.tagline}>SELECT * FROM experience;</span>

        <h2 className={styles.sectionTitle}>
          {t.experience.title}
        </h2>
      </div>

      <div className={styles.experienceList}>
        {experiences.map((experience) => (
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
              {t.experience.activitiesTitle}
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

