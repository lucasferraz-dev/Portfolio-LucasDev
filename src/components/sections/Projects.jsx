import { useState } from 'react';
import styles from './Projects.module.css';
import FotoSave from '../../assets/savepoint.png';
import FotoRotinas from '../../assets/rotinas-gobpr.png';
import FotoHackathon from '../../assets/hackathon-localiza.jpg';

const CATEGORIES = [
  { id: 'todos', label: 'TODOS' },
  { id: 'software', label: 'SOFTWARE' },
  { id: 'hackathon', label: 'HACKATHON' },
  { id: 'academico', label: 'ACADÊMICO' },
  { id: 'social', label: 'SOCIAL / COLETIVO' },
  { id: 'experimento', label: 'EXPERIMENTOS' },
];

const PROJECTS = [
  {
    id: 'ROW_01',
    title: 'Sistema de Rotinas - GOB/PR Digital',
    category: 'software',
    categoryLabel: 'Full Stack',
    period: 'Set/2026 - Atualmente',
    context: 'Grande Oriente do Brasil - Paraná - Estágio em TI',
    role: 'Desenvolvedor full-stack - modelagem, back-end em Django e interface',
    description:
      'Sistema web para cadastrar, versionar e consultar as rotinas de trabalho de cada secretaria, apresentando cada processo como um mapa visual de etapas com entradas e saídas. Desenvolvido com base nos requisitos das normas ISO 9001 (gestão da qualidade) e ISO 37001 (sistema de gestão antissuborno).',
    problem:
      'O conhecimento sobre como cada processo funcionava ficava concentrado nas pessoas. Quando alguém saía ou a equipe se reorganizava, não havia um lugar único, simples e confiável para consultar quem executa cada etapa, o que recebe e o que entrega.',
    process: [
      'Estudei os requisitos da ISO 9001 (abordagem por processos e controle de informação documentada) e da ISO 37001 (controles, rastreabilidade e responsabilidades) e os traduzi em regras do sistema;',
      'Mapeei com as secretarias como as rotinas eram executadas e defini um formato padrão: etapas com entrada (quem executa, o que recebe) e saída (para quem, o que entrega);',
      'Modelei secretarias, rotinas, versões e etapas, com código padronizado por secretaria (ex.: ADM-001);',
      'Implementei o ciclo de vida da rotina: em elaboração, aprovação e publicação, com histórico e criação de novas versões sem perder a vigente, atendendo ao controle de documentos exigido pelas normas;',
      'Construí o mapa do processo visual e uma versão para impressão, para consulta rápida por quem não é técnico;',
      'Adicionei controle de acesso por secretaria, rotinas públicas (somente leitura para todos) e autenticação em dois fatores (app autenticador, códigos reserva e e-mail).',
    ],
    learnings: [
      'Documentar processo só funciona se consultar for mais fácil do que perguntar para alguém;',
      'Norma vira software quando cada requisito vira uma regra concreta: quem aprova, o que fica registrado e quem pode ver;',
      'Versionamento e fluxo de aprovação são o que dão confiança de que a informação publicada é a vigente;',
      'Django acelera muito o desenvolvimento de sistemas internos: autenticação, admin e ORM resolvem boa parte da base.',
    ],
    tags: ['Python', 'Django', 'Banco de Dados', 'MFA', 'ISO 9001', 'ISO 37001'],
    image: FotoRotinas,
    links: [],
  },

  {
    id: 'ROW_02',
    title: 'Hackathon Recarga Inteligente - Localiza&Co',
    category: 'hackathon',
    categoryLabel: 'Liderança',
    period: '21/Out/2026 - 11 horas (8h às 19h)',
    context: 'Hackathon do processo seletivo de estágio da Localiza&Co - cerca de 90 participantes em 16+ equipes',
    role: 'Líder da equipe (5 pessoas) e responsável pelo planejamento e estratégia',
    result: 'Top 10 geral, com cerca de 35 mil pontos (1º lugar com cerca de 37 mil); chegamos a ficar no top 4',
    description:
      'Motor de simulação em Python que estimava a nota de cada configuração de agências fictícias de aluguel de carros elétricos (carregadores, entrada elétrica, demanda contratada e política de recarga) antes de enviá-la ao simulador oficial do evento.',
    problem:
      'Cada agência precisava atender o máximo de clientes gastando o mínimo de infraestrutura e potência. A nota vinha de um simulador oficial (o "juiz"), mas cada consulta e cada reenvio custavam moedas limitadas, os pesos da pontuação ficavam ocultos na primeira metade do dia e a nota final era calculada em semanas que nenhuma equipe via.',
    process: [
      'Sem notebook próprio (eram 3 notebooks para 5 pessoas, um deles com a placa de rede com defeito), assumi o planejamento e, por propor a maior parte das ideias, acabei me tornando o líder do grupo;',
      'Organizei o trabalho com MoSCoW e EAP, identifiquei os problemas centrais do desafio e defini a estratégia; tudo o que a equipe implementava passava por mim para ser aprovado ou, pelo menos, entendido;',
      'Construímos um motor que simulava a nota a partir do JSON de configuração. Como os resultados muitas vezes divergiam dos do juiz, ele foi calibrado e melhorado continuamente ao longo do dia;',
      'Começamos tentando aplicar machine learning. Depois de 3 horas sem resultado, tomei a decisão de abandonar essa abordagem e partir para um script de força bruta sobre o nosso motor, que funcionou muito melhor, principalmente depois que os pesos foram revelados;',
      'Fiz a ponte com os mentores, apresentando nossa estratégia e tirando dúvidas, e no final assumi o lugar dos desenvolvedores em rodízio, para que descansassem enquanto eu continuava os testes e melhorias.',
    ],
    learnings: [
      'Saber quando mudar de estratégia: abandonar 3 horas de trabalho em ML foi a decisão mais difícil do dia e também a que mais rendeu;',
      'Arquitetura e planejamento pesam tanto quanto a prototipação, e um modelo próprio confiável economiza recursos que não voltam (cada reenvio custava o dobro do anterior);',
      'Liderar é segurar o cansaço e a ansiedade para não contaminar a equipe, assumir as críticas e manter o grupo entregando mesmo com recursos limitados;',
      'Explicar bem conceitos como MoSCoW, EAP e estratégia de negócio para o time, e a nossa estratégia para os mentores, é parte do trabalho tanto quanto escrever código;',
      'Consistência também é resultado: enquanto algumas equipes chegaram a -120 mil pontos, nos mantivemos no top 10 o dia inteiro.',
    ],
    tags: ['Python', 'Simulação', 'Força Bruta', 'Liderança', 'Planejamento', 'MoSCoW / EAP'],
    image: FotoHackathon,
    links: [],
  },

  {
    id: 'ROW_03',
    title: 'Save Point',
    category: 'academico',
    categoryLabel: 'Full Stack',
    period: 'Mar/2026 - Atualmente',
    context: 'Projeto acadêmico - Ciência da Computação (PUCPR) - executado localmente',
    role: 'Desenvolvedor full-stack - modelagem do banco, API e interface',
    description:
      'Plataforma full-stack para gamers organizarem seu backlog, gerenciarem seus perfis e compararem a experiência de diferentes jogos e versões.',
    problem:
      'Jogadores acumulam dezenas de jogos não terminados espalhados entre plataformas diferentes e não têm um lugar único para acompanhar o que já jogaram, o que abandonaram e o que vale retomar.',
    process: [
      'Modelei o banco relacional (usuários, jogos, versões, status de progresso) antes de escrever qualquer tela;',
      'Construí a API REST em Node.js + Express e integrei uma API externa de catálogo de jogos;',
      'Desenvolvi o front-end em React consumindo a API, priorizando a listagem e a troca de status como fluxo principal;',
      'Gravei uma demo navegando pelo sistema, já que ele roda localmente e não foi publicado.',
    ],
    learnings: [
      'Modelar o dado primeiro economiza retrabalho: quase toda mudança de tela que evitei veio de um schema bem pensado;',
      'Integrar API de terceiros exige tratar falha e limite de requisição como regra, não como exceção.',
    ],
    tags: ['React', 'Node.js', 'MySQL', 'Express', 'API Integration'],
    image: FotoSave,
    links: [
      { label: 'VER DEMO', url: 'https://youtu.be/WEJ--3yszYM' },
      { label: 'REPOSITÓRIO', url: 'https://github.com/lucasferraz-dev/save_point' },
    ],
  },
];

function ProjectCard({ project }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `${project.id}-details`;

  return (
    <article className={styles.card}>
      <div className={styles.cardMain}>
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
            {project.result && (
              <div className={styles.metaItem}>
                <dt className={styles.metaKey}>resultado</dt>
                <dd className={`${styles.metaValue} ${styles.metaHighlight}`}>{project.result}</dd>
              </div>
            )}
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
      </div>

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