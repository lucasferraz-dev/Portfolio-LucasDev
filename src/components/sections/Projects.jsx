import { useEffect, useRef, useState } from 'react';
import styles from './Projects.module.css';
import RichText, { OPEN_PROJECT_EVENT } from '../common/RichText';
import FotoSave from '../../assets/savepoint.webp';
import FotoRotinas from '../../assets/rotinas-gobpr.webp';
import FotoHackathon from '../../assets/hackathon-localiza.jpg';
import { useLanguage } from '../../i18n/useLanguage';

const CATEGORY_IDS = ['todos', 'software', 'hackathon', 'academico', 'social', 'experimento'];

const DEFAULT_RATIO = 16 / 9;
const MIN_RATIO = 16 / 10;
const MAX_RATIO = 16 / 9;

const PROJECTS = [
  {
    id: 'ROW_01',
    category: 'software',
    image: FotoRotinas,
    imagePosition: 'top',
    links: [],
  },

  {
    id: 'ROW_02',
    category: 'hackathon',
    image: FotoHackathon,
    imagePosition: 'center',
    links: [],
  },

  {
    id: 'ROW_03',
    category: 'academico',
    image: FotoSave,
    imagePosition: 'center',
    links: [
      { labelKey: 'demo', url: 'https://youtu.be/WEJ--3yszYM' },
      { labelKey: 'repo', url: 'https://github.com/lucasferraz-dev/save_point' },
    ],
  },
];

function ProjectLinks({ project, className }) {
  const { t } = useLanguage();

  return project.links.map((link) => (
    <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className={className}>
      {t.projects.links[link.labelKey]} <span className={styles.arrow}>→</span>
    </a>
  ));
}

function ProjectCard({ project, onOpenProcess }) {
  const { t } = useLanguage();
  const [ratio, setRatio] = useState(DEFAULT_RATIO);

  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (!naturalWidth || !naturalHeight) return;
    setRatio(Math.min(Math.max(naturalWidth / naturalHeight, MIN_RATIO), MAX_RATIO));
  };

  return (
    <article id={`project-${project.id}`} className={styles.card}>
      <div className={styles.media} style={{ aspectRatio: ratio }}>
        {project.image ? (
          <img
            src={project.image}
            alt={t.projects.imageAlt(project.title)}
            className={styles.image}
            style={{ objectPosition: project.imagePosition }}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span className={styles.placeholderText}>[ {project.title.toUpperCase()} ]</span>
            <span className={styles.placeholderSub}>NO_PREVIEW_AVAILABLE</span>
          </div>
        )}

        <span className={styles.hoverHint} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={styles.hoverHintIcon}>
            <path d="M4 3l7 17 2.5-7.5L21 10z" />
          </svg>
          {t.projects.hoverHint}
        </span>

        <div className={styles.overlay}>
          <span className={styles.overlayBadge}>{project.categoryLabel}</span>
          <h3 className={styles.overlayTitle}>{project.title}</h3>
          <span className={styles.overlayPeriod}>{project.period}</span>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.projectId}>{project.id}</span>
          <h4 className={styles.panelTitle}>{project.title}</h4>
        </div>

        <p className={styles.summary}>
          <RichText text={project.summary} />
        </p>

        <div className={styles.tagsContainer}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.processButton} onClick={() => onOpenProcess(project.id)}>
            {t.projects.viewProcess}
          </button>
          <ProjectLinks project={project} className={styles.linkButton} />
        </div>
      </div>
    </article>
  );
}

function ProjectModal({ project, onClose }) {
  const { t } = useLanguage();
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (project) {
      if (!dialog.open) dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    } else if (dialog.open) {
      dialog.close();
    }

    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [project]);

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby="project-modal-title"
    >
      {project && (
        <div className={styles.modalContent}>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label={t.projects.close}>
            ×
          </button>

          {project.image && (
            <img src={project.image} alt="" className={styles.modalImage} decoding="async" />
          )}

          <div className={styles.modalBody}>
            <div className={styles.modalHeader}>
              <span className={styles.categoryBadge}>{project.categoryLabel}</span>
              <h3 id="project-modal-title" className={styles.modalTitle}>{project.title}</h3>
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

            <p className={styles.projectDescription}>
              <RichText text={project.description} />
            </p>

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

            <div className={styles.tagsContainer}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>

            {project.links.length > 0 && (
              <div className={styles.modalLinks}>
                <ProjectLinks project={project} className={styles.projectLink} />
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}

export default function Projects() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('todos');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const openProject = (id) => {
      setActiveCategory('todos');
      setSelectedId(id);
    };

    const handleOpenProject = (event) => openProject(event.detail);
    window.addEventListener(OPEN_PROJECT_EVENT, handleOpenProject);

    const linkedProject = window.location.hash.match(/^#project-(.+)$/)?.[1];
    if (linkedProject) openProject(linkedProject);

    return () => window.removeEventListener(OPEN_PROJECT_EVENT, handleOpenProject);
  }, []);

  const closeProject = () => {
    setSelectedId(null);
    if (window.location.hash.startsWith('#project-')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const projects = PROJECTS.map((project) => ({
    ...project,
    ...t.projects.items[project.id],
  }));

  const selectedProject = projects.find((p) => p.id === selectedId) ?? null;

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
        {filtered.map((project, index) => (
          <div
            key={project.id}
            className={`${styles.row} ${index % 2 === 0 ? styles.rowRight : styles.rowLeft}`}
          >
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railLine} />
              <span className={styles.railDot} />
              <div className={styles.railLabel}>
                <span className={styles.railIndex}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.railMeta}>{project.categoryLabel}</span>
              </div>
            </div>

            <ProjectCard project={project} onOpenProcess={setSelectedId} />
          </div>
        ))}
      </div>

      <ProjectModal project={selectedProject} onClose={closeProject} />
    </section>
  );
}
