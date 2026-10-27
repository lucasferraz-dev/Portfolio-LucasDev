import { useEffect, useRef, useState } from 'react';
import styles from './Projects.module.css';
import RichText, { OPEN_PROJECT_EVENT } from '../common/RichText';
import FotoSave from '../../assets/savepoint.png';
import FotoRotinas from '../../assets/rotinas-gobpr.png';
import FotoHackathon from '../../assets/hackathon-localiza.jpg';
import { useLanguage } from '../../i18n/useLanguage';

const CATEGORY_IDS = ['todos', 'software', 'hackathon', 'academico', 'social', 'experimento'];

const PROJECTS = [
  {
    id: 'ROW_01',
    category: 'software',
    image: FotoRotinas,
    links: [],
  },

  {
    id: 'ROW_02',
    category: 'hackathon',
    image: FotoHackathon,
    links: [],
  },

  {
    id: 'ROW_03',
    category: 'academico',
    image: FotoSave,
    links: [
      { labelKey: 'demo', url: 'https://youtu.be/WEJ--3yszYM' },
      { labelKey: 'repo', url: 'https://github.com/lucasferraz-dev/save_point' },
    ],
  },
];

function ProjectCard({ project, openRequest }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef(null);
  const panelId = `${project.id}-details`;

  useEffect(() => {
    if (!openRequest) return;
    setIsOpen(true);
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [openRequest]);

  return (
    <article ref={cardRef} id={`project-${project.id}`} className={styles.card}>
      <div className={styles.cardMain}>
        <div className={styles.imageWrapper}>
          {project.image ? (
            <>
              <img src={project.image} alt="" aria-hidden="true" className={styles.imageBackdrop} />
              <img src={project.image} alt={t.projects.imageAlt(project.title)} className={styles.image} />
            </>
          ) : (
            <div className={styles.imagePlaceholder}>
              <span className={styles.placeholderText}>[ {project.title.toUpperCase()} ]</span>
              <span className={styles.placeholderSub}>NO_PREVIEW_AVAILABLE</span>
            </div>
          )}
        </div>

        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <div className={styles.titleRow}>
              <span className={styles.projectId}>{project.id}</span>
              <h3 className={styles.projectTitle}>{project.title}</h3>
            </div>
            <span className={styles.categoryBadge}>{project.categoryLabel}</span>
          </div>

          <dl className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <dt className={styles.metaKey}>{t.projects.meta.where}</dt>
              <dd className={styles.metaValue}>{project.context}</dd>
            </div>
            <div className={styles.metaItem}>
              <dt className={styles.metaKey}>{t.projects.meta.when}</dt>
              <dd className={styles.metaValue}>{project.period}</dd>
            </div>
            <div className={styles.metaItem}>
              <dt className={styles.metaKey}>{t.projects.meta.role}</dt>
              <dd className={styles.metaValue}>{project.role}</dd>
            </div>
            {project.result && (
              <div className={styles.metaItem}>
                <dt className={styles.metaKey}>{t.projects.meta.result}</dt>
                <dd className={`${styles.metaValue} ${styles.metaHighlight}`}>{project.result}</dd>
              </div>
            )}
          </dl>

          <p className={styles.projectDescription}><RichText text={project.description} /></p>

          <div className={styles.tagsContainer}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>

          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls={panelId}
          >
            {isOpen ? t.projects.hideDetails : t.projects.showDetails}
            <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>▾</span>
          </button>

          {project.links?.length > 0 && (
            <div className={styles.cardFooter}>
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.projectLink}
                >
                  {t.projects.links[link.labelKey]} <span className={styles.arrow}>→</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div id={panelId} className={styles.details}>
          {project.problem && (
            <div className={styles.detailBlock}>
              <h4 className={styles.detailTitle}>{t.projects.problemTitle}</h4>
              <p className={styles.detailText}><RichText text={project.problem} /></p>
            </div>
          )}

          {project.process?.length > 0 && (
            <div className={styles.detailBlock}>
              <h4 className={styles.detailTitle}>{t.projects.processTitle}</h4>
              <ul className={styles.detailList}>
                {project.process.map((step, i) => (
                  <li key={step} className={styles.detailItem}>
                    <span className={styles.stepNumber}>{String(i + 1).padStart(2, '0')}</span>
                    <RichText text={step} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.learnings?.length > 0 && (
            <div className={styles.detailBlock}>
              <h4 className={styles.detailTitle}>{t.projects.learningsTitle}</h4>
              <ul className={styles.detailList}>
                {project.learnings.map((item) => (
                  <li key={item} className={styles.detailItem}>
                    <span className={styles.stepBullet}>&gt;</span>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function Projects() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('todos');
  const [openRequest, setOpenRequest] = useState(null);

  useEffect(() => {
    const openProject = (id) => {
      setActiveCategory('todos');
      setOpenRequest({ id, at: Date.now() });
    };

    const handleOpenProject = (event) => openProject(event.detail);
    window.addEventListener(OPEN_PROJECT_EVENT, handleOpenProject);

    const linkedProject = window.location.hash.match(/^#project-(.+)$/)?.[1];
    if (linkedProject) openProject(linkedProject);

    return () => window.removeEventListener(OPEN_PROJECT_EVENT, handleOpenProject);
  }, []);

  const projects = PROJECTS.map((project) => ({
    ...project,
    ...t.projects.items[project.id],
  }));

  const visibleCategories = CATEGORY_IDS
    .filter((id) => id === 'todos' || projects.some((p) => p.category === id))
    .map((id) => ({ id, label: t.projects.categories[id] }));

  const filtered =
    activeCategory === 'todos'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className={styles.sectionContainer}>
      <div className={styles.header}>
        <span className={styles.tagline}>EXECUTE query_projects;</span>
        <h2 className={styles.sectionTitle}>{t.projects.title}</h2>
        <p className={styles.sectionSubtitle}>
          {t.projects.subtitle}
        </p>
      </div>

      {visibleCategories.length > 2 && (
        <div className={styles.filters} role="tablist" aria-label={t.projects.filterLabel}>
          <span className={styles.filterPrefix}>WHERE type =</span>
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`${styles.filterButton} ${activeCategory === cat.id ? styles.filterActive : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      <div className={styles.grid}>
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            openRequest={openRequest?.id === project.id ? openRequest : null}
          />
        ))}
      </div>
    </section>
  );
}