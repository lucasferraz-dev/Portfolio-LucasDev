import { useEffect, useRef, useState } from 'react';
import styles from './Projects.module.css';
import RichText, { OPEN_PROJECT_EVENT } from '../common/RichText';
import FotoSave from '../../assets/savepoint.webp';
import FotoRotinas from '../../assets/rotinas-gobpr.webp';
import FotoHackathon from '../../assets/hackathon-localiza.jpg';
import FotoSkinomicsLanding from '../../assets/skinomics-landing.webp';
import FotoSkinomicsExplorar from '../../assets/skinomics-explorar.webp';
import FotoSkinomicsItem from '../../assets/skinomics-item.webp';
import { useLanguage } from '../../i18n/useLanguage';

const CATEGORY_IDS = ['todos', 'software', 'hackathon', 'academico', 'social', 'experimento'];

const DEFAULT_RATIO = 16 / 9;
const MIN_RATIO = 16 / 10;
const MAX_RATIO = 16 / 9;

const PROJECTS = [
  {
    id: 'ROW_01',
    category: 'software',
    images: [FotoRotinas],
    imagePosition: 'top',
    links: [],
  },

  {
    id: 'ROW_02',
    category: 'hackathon',
    images: [FotoHackathon],
    imagePosition: 'center',
    links: [],
  },

  {
    id: 'ROW_03',
    category: 'academico',
    images: [FotoSave],
    imagePosition: 'center',
    links: [
      { labelKey: 'demo', url: 'https://youtu.be/WEJ--3yszYM' },
      { labelKey: 'repo', url: 'https://github.com/lucasferraz-dev/save_point' },
    ],
  },

  {
    id: 'ROW_04',
    category: 'academico',
    images: [FotoSkinomicsLanding, FotoSkinomicsExplorar, FotoSkinomicsItem],
    imagePosition: 'center',
    links: [
      { labelKey: 'site', url: 'https://skinomics.ferrazdeveloper.com/' },
      { labelKey: 'repo', url: 'https://github.com/lucasferraz-dev/skinomics' },
    ],
  },
];

const SWIPE_THRESHOLD = 40;

const plainText = (text) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

function ProjectLinks({ project, className }) {
  const { t } = useLanguage();

  return project.links.map((link) => (
    <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className={className}>
      {t.projects.links[link.labelKey]} <span className={styles.arrow}>→</span>
    </a>
  ));
}

/*
 * Card: a foto inteira com título e período por cima. No hover a imagem dá um
 * zoom leve, o resumo sobe por baixo do título e uma bolinha "Ver processo"
 * acompanha o mouse. O card todo é um botão que abre o modal.
 */
function ProjectCard({ project, onOpenProcess }) {
  const { t } = useLanguage();
  const [ratio, setRatio] = useState(DEFAULT_RATIO);

  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (!naturalWidth || !naturalHeight) return;
    setRatio(Math.min(Math.max(naturalWidth / naturalHeight, MIN_RATIO), MAX_RATIO));
  };

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`);
  };

  const cover = project.images[0];

  return (
    <article id={`project-${project.id}`} className={styles.card}>
      <button
        type="button"
        className={styles.cardButton}
        onClick={() => onOpenProcess(project.id)}
        onPointerMove={handlePointerMove}
        aria-label={`${t.projects.viewProcess}: ${project.title}`}
      >
        <div className={styles.media} style={{ aspectRatio: ratio }}>
          {cover ? (
            <img
              src={cover}
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
            </div>
          )}

          {project.images.length > 1 && (
            <span className={styles.photoCount}>
              <svg viewBox="0 0 24 24" className={styles.photoCountIcon} aria-hidden="true">
                <rect x="3" y="6" width="14" height="12" rx="2" />
                <path d="M7 3h12a2 2 0 0 1 2 2v10" />
              </svg>
              {t.projects.gallery.count(project.images.length)}
            </span>
          )}

          <div className={styles.overlay}>
            <span className={styles.overlayBadge}>{project.categoryLabel}</span>
            <h3 className={styles.overlayTitle}>{project.title}</h3>
            <span className={styles.overlayPeriod}>{project.period}</span>

            <div className={styles.reveal}>
              <div className={styles.revealInner}>
                <p className={styles.revealSummary}>{plainText(project.summary)}</p>
                <div className={styles.revealTags}>
                  {(project.cardTags ?? project.tags).slice(0, 5).map((tag) => (
                    <span key={tag} className={styles.revealTag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <span className={styles.cursorBubble} aria-hidden="true">
            {t.projects.viewProcess}
          </span>
        </div>
      </button>
    </article>
  );
}

/*
 * Galeria do modal: a foto aparece inteira (sem corte) ocupando o painel,
 * com setas, contador e miniaturas quando o projeto tem mais de uma imagem.
 */
function ProjectGallery({ images, title }) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  if (images.length === 0) return <div className={styles.gallery} />;

  const multiple = images.length > 1;
  const go = (step) => setIndex((current) => (current + step + images.length) % images.length);

  const handleKeyDown = (event) => {
    if (!multiple) return;
    if (event.key === 'ArrowRight') go(1);
    else if (event.key === 'ArrowLeft') go(-1);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (!multiple || touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > SWIPE_THRESHOLD) go(delta < 0 ? 1 : -1);
  };

  return (
    <div
      className={styles.gallery}
      role={multiple ? 'region' : undefined}
      aria-roledescription={multiple ? 'carousel' : undefined}
      aria-label={multiple ? t.projects.gallery.label(title) : undefined}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.galleryViewport} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <img key={`backdrop-${index}`} src={images[index]} alt="" aria-hidden="true" className={styles.galleryBackdrop} />
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={multiple ? t.projects.gallery.imageAlt(title, i + 1, images.length) : t.projects.imageAlt(title)}
            aria-hidden={i !== index}
            className={`${styles.gallerySlide} ${i === index ? styles.gallerySlideActive : ''}`}
            decoding="async"
          />
        ))}

        {multiple && (
          <>
            <button
              type="button"
              className={`${styles.galleryNav} ${styles.galleryPrev}`}
              onClick={() => go(-1)}
              aria-label={t.projects.gallery.prev}
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.galleryNav} ${styles.galleryNext}`}
              onClick={() => go(1)}
              aria-label={t.projects.gallery.next}
            >
              ›
            </button>
            <span className={styles.galleryCounter} aria-live="polite">
              {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
          </>
        )}
      </div>

      {multiple && (
        <div className={styles.galleryThumbs}>
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`${styles.galleryThumb} ${i === index ? styles.galleryThumbActive : ''}`}
              onClick={() => setIndex(i)}
              aria-label={t.projects.gallery.goTo(i + 1)}
              aria-current={i === index}
            >
              <img src={src} alt="" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/*
 * Modal em duas colunas no desktop: a galeria à esquerda e o conteúdo à direita,
 * que rola sozinho com uma barra fina. Cada bloco entra em cascata (--i).
 * No celular vira uma coluna só, com a foto em cima.
 */
function ProjectModal({ project, onClose }) {
  const { t } = useLanguage();
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (project) {
      if (!dialog.open) {
        dialog.showModal();
        dialog.querySelector('[data-autofocus]')?.focus({ focusVisible: false });
      }
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

  let block = 0;
  const reveal = () => ({ '--i': block++ });

  const meta = project
    ? [
        { key: t.projects.meta.where, value: project.context },
        { key: t.projects.meta.when, value: project.when ?? project.period },
        { key: t.projects.meta.role, value: project.role },
        project.result && { key: t.projects.meta.result, value: project.result, highlight: true },
      ].filter(Boolean)
    : [];

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby="project-modal-title"
    >
      {project && (
        <div key={project.id} className={styles.modalLayout}>
          <ProjectGallery images={project.images} title={project.title} />

          <div className={styles.modalBody}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label={t.projects.close}
              data-autofocus
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <header className={styles.modalHeader} style={reveal()}>
              <span className={styles.categoryBadge}>{project.categoryLabel}</span>
              <h3 id="project-modal-title" className={styles.modalTitle}>{project.title}</h3>
              {project.links.length > 0 && (
                <div className={styles.modalLinks}>
                  <ProjectLinks project={project} className={styles.projectLink} />
                </div>
              )}
            </header>

            <dl className={styles.metaGrid} style={reveal()}>
              {meta.map((item) => (
                <div key={item.key} className={styles.metaItem}>
                  <dt className={styles.metaKey}>{item.key}</dt>
                  <dd className={`${styles.metaValue} ${item.highlight ? styles.metaHighlight : ''}`}>{item.value}</dd>
                </div>
              ))}
            </dl>

            <p className={styles.projectDescription} style={reveal()}>
              <RichText text={project.description} />
            </p>

            {project.problem && (
              <section className={styles.detailBlock} style={reveal()}>
                <h4 className={styles.detailTitle}>{t.projects.problemTitle}</h4>
                <p className={styles.detailText}><RichText text={project.problem} /></p>
              </section>
            )}

            {project.process?.length > 0 && (
              <section className={styles.detailBlock} style={reveal()}>
                <h4 className={styles.detailTitle}>{t.projects.processTitle}</h4>
                <ol className={styles.steps}>
                  {project.process.map((step, i) => (
                    <li key={step} className={styles.step}>
                      <span className={styles.stepNumber}>{i + 1}</span>
                      <span className={styles.stepText}><RichText text={step} /></span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {project.learnings?.length > 0 && (
              <section className={styles.detailBlock} style={reveal()}>
                <h4 className={styles.detailTitle}>{t.projects.learningsTitle}</h4>
                <ul className={styles.learnings}>
                  {project.learnings.map((item) => (
                    <li key={item} className={styles.learning}>
                      <RichText text={item} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className={styles.tagsContainer} style={reveal()}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
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
