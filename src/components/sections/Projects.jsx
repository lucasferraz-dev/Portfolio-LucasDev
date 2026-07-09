import styles from './Projects.module.css';
import FotoSave from '../../assets/savepoint.png';

const PROJECTS = [
  {
    id: 'ROW_01',
    title: 'Save Point',
    description: 'Plataforma full-stack para gamers multiplataforma gerenciarem seu backlog de jogos, organizarem perfis e avaliarem de forma isolada a otimização de cada porte/versão.',
    tags: ['React', 'Node.js', 'MySQL', 'Express', 'API Integration'],
    link: 'https://youtu.be/WEJ--3yszYM',
    image: '/savepoint.png'
  }
];

export default function Projects() {
  return (
    <section id="projects" className={styles.sectionContainer}>
      <div className={styles.header}>
        <span className={styles.tagline}>EXECUTE query_projects;</span>
        <h2 className={styles.sectionTitle}>Projetos em Destaque</h2>
      </div>
      <div className={styles.grid}>
        {PROJECTS.map((project) => (
          <div key={project.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={FotoSave} alt={project.title} className={styles.image} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <span className={styles.projectId}>{project.id}</span>
                <h3 className={styles.projectTitle}>{project.title}</h3>
              </div>
              <p className={styles.projectDescription}>{project.description}</p>
              <div className={styles.tagsContainer}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              {project.link !== '#' && (
                <div className={styles.cardFooter}>
                  <a href={project.link} target="_blank" rel="noreferrer" className={styles.projectLink}>
                    RETURN DATA <span className={styles.arrow}>→</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}