import { useState } from 'react';
import styles from './Projects.module.css';
import FotoSave from '../../assets/savepoint.png';
import FotoFrafem from '../../assets/frafem.PNG'

const CATEGORIES = [
  { id: 'todos', label: 'TODOS' },
  { id: 'software', label: 'SOFTWARE' },
  { id: 'academico', label: 'ACADÊMICO' },
  { id: 'social', label: 'SOCIAL / COLETIVO' },
  { id: 'experimento', label: 'EXPERIMENTOS' },
];

const PROJECTS = [
  {
    id: 'ROW_01',
    title: 'Save Point',
    category: 'software',
    categoryLabel: 'Full Stack',
    period: 'Mar/2026 - Atualmente',
    context: 'Projeto próprio / acadêmico - Ciência da Computação',
    role: 'Desenvolvedor full-stack - modelagem do banco, API e interface',
    description:
      'Plataforma full-stack desenvolvida para gamers organizarem seu backlog, gerenciarem seus perfis e compararem a experiência de diferentes jogos e versões.',
    problem:
      'Jogadores acumulam dezenas de jogos não terminados espalhados entre plataformas diferentes e não têm um lugar único para acompanhar o que já jogaram, o que abandonaram e o que vale retomar.',
    process: [
      'Levantei o problema conversando com jogadores sobre como eles controlam o backlog hoje (planilha, memória, nada);',
      'Modelei o banco relacional (usuários, jogos, versões, status de progresso) antes de escrever qualquer tela;',
      'Construí a API REST em Node.js + Express e integrei uma API externa de catálogo de jogos;',
      'Desenvolvi o front-end em React consumindo a API, priorizando a listagem e a troca de status como fluxo principal;',
      'Testei com usuários reais e ajustei a navegação a partir do que travou pra eles.',
    ],
    learnings: [
      'Modelar o dado primeiro economiza retrabalho: quase toda mudança de tela que evitei veio de um schema bem pensado;',
      'Integrar API de terceiros exige tratar falha e limite de requisição como regra, não como exceção;',
      'O que é óbvio pra quem construiu quase nunca é óbvio pra quem usa pela primeira vez.',
    ],
    tags: ['React', 'Node.js', 'MySQL', 'Express', 'API Integration'],
    image: FotoSave,
    links: [
      { label: 'VER DEMO', url: 'https://youtu.be/WEJ--3yszYM' },
      { label: 'REPOSITÓRIO', url: 'https://github.com/lucasferraz-dev/save_point' },
    ],
  },

  {
    id: 'ROW_02',
    title: 'Automação de processos internos - GOB/PR',
    category: 'software',
    categoryLabel: 'Automação',
    period: 'Ago/2026 - Atualmente',
    context: 'Grande Oriente do Brasil - Paraná - Estágio em TI',
    role: 'Responsável pelo levantamento, desenvolvimento e manutenção',
    description:
      'Desenvolvimento e organização de soluções para automatizar processos internos, reduzindo tarefas manuais e facilitando o gerenciamento de informações.',
    problem:
      'Processos administrativos dependiam de preenchimento manual de planilhas, o que gerava retrabalho e erro humano.',
    process: [
      'Acompanhei o time administrativo para mapear onde o tempo estava sendo perdido;',
      'Automatizei as etapas repetitivas com planilhas e scripts;',
      'Desenvolvi páginas web internas para os fluxos que precisavam de entrada de dados;',
      'Dei suporte e ajustei as ferramentas conforme o uso real da equipe.',
    ],
    learnings: [
      'Usuário não técnico descreve sintoma, não problema a entrevista vale mais que o requisito escrito;',
      'Uma automação só é útil se a pessoa consegue usar sem me chamar.',
    ],
    tags: ['Automação', 'Web', 'Banco de Dados', 'Suporte'],
    image: FotoFrafem,
    links: [],
  },
];

function ProjectCard({ project }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `${project.id}-details`;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        {project.image ? (
          <img src={project.image} alt={`Interface do projeto ${project.title}`} className={styles.image} />
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
            <dt className={styles.metaKey}>onde</dt>
            <dd className={styles.metaValue}>{project.context}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt className={styles.metaKey}>quando</dt>
            <dd className={styles.metaValue}>{project.period}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt className={styles.metaKey}>meu papel</dt>
            <dd className={styles.metaValue}>{project.role}</dd>
          </div>
        </dl>

        <p className={styles.projectDescription}>{project.description}</p>

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
          {isOpen ? 'FECHAR DETALHES' : 'VER PROCESSO E APRENDIZADOS'}
          <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>▾</span>
        </button>

        {isOpen && (
          <div id={panelId} className={styles.details}>
            {project.problem && (
              <div className={styles.detailBlock}>
                <h4 className={styles.detailTitle}>O problema</h4>
                <p className={styles.detailText}>{project.problem}</p>
              </div>
            )}

            {project.process?.length > 0 && (
              <div className={styles.detailBlock}>
                <h4 className={styles.detailTitle}>Como foi o processo</h4>
                <ul className={styles.detailList}>
                  {project.process.map((step, i) => (
                    <li key={step} className={styles.detailItem}>
                      <span className={styles.stepNumber}>{String(i + 1).padStart(2, '0')}</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.learnings?.length > 0 && (
              <div className={styles.detailBlock}>
                <h4 className={styles.detailTitle}>O que eu aprendi</h4>
                <ul className={styles.detailList}>
                  {project.learnings.map((item) => (
                    <li key={item} className={styles.detailItem}>
                      <span className={styles.stepBullet}>&gt;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

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
                {link.label} <span className={styles.arrow}>→</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('todos');

  const visibleCategories = CATEGORIES.filter(
    (cat) => cat.id === 'todos' || PROJECTS.some((p) => p.category === cat.id)
  );

  const filtered =
    activeCategory === 'todos'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className={styles.sectionContainer}>
      <div className={styles.header}>
        <span className={styles.tagline}>EXECUTE query_projects;</span>
        <h2 className={styles.sectionTitle}>Projetos</h2>
        <p className={styles.sectionSubtitle}>
          Projetos de software, trabalhos acadêmicos e iniciativas coletivas — com o
          contexto, o processo e o que ficou de cada um.
        </p>
      </div>

      {visibleCategories.length > 2 && (
        <div className={styles.filters} role="tablist" aria-label="Filtrar projetos por categoria">
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
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}