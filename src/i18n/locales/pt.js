export default {
  meta: {
    title: 'Lucas Ferraz dos Santos | Desenvolvedor de Software',
    description:
      'Portfólio de Lucas Ferraz dos Santos — estudante de Ciência da Computação e desenvolvedor de software. Projetos de software, automação e bancos de dados.',
  },

  app: {
    skipLink: 'Pular para o conteúdo',
  },

  header: {
    nav: {
      about: 'Sobre',
      projects: 'Projetos',
      skills: 'Skills',
      journey: 'Trajetória',
      contact: 'Contato',
    },
    mainNav: 'Navegação principal',
    mobileNav: 'Navegação mobile',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    language: 'Idioma',
    lightMode: 'Ativar modo claro',
    darkMode: 'Ativar modo escuro',
  },

  hero: {
    typedPrefix: 'eu construo',
    typedPhrases: ['sistemas web', 'sistemas internos', 'automações', 'APIs REST', 'soluções para problemas reais'],
    subtitle:
      'Desenvolvedor de software, com experiência em aplicações web, sistemas internos e automação de processos.',
    description:
      'Estudante de Ciência da Computação na PUCPR e estagiário de TI, trabalhando com Python, Django, React e bancos de dados.',
    ctaProjects: 'Ver Projetos',
    ctaContact: 'Contato',
    ctaResume: 'Baixar Currículo',
    resumeFile: '/cv/Curriculo_LucasF_PT.pdf',
    scrollHint: 'Role para me conhecer',
    role: 'Estagiário de TI @ GOB-PR',
  },

  about: {
    title: 'Quem eu sou',
    lead: 'Comecei a programar querendo entender como as coisas que eu usava todos os dias funcionavam por trás. Hoje o que mais me prende é o outro lado: descobrir por que um processo não funciona antes de decidir o que construir.',
    paragraphs: [
      'Estudo Ciência da Computação na PUCPR desde 2024 e, em outubro de 2025, entrei como estagiário de TI no Grande Oriente do Brasil - Paraná. Comecei no suporte e na automação de planilhas e hoje desenvolvo [o sistema que guarda as rotinas de trabalho de cada secretaria](#project-ROW_01), para que o conhecimento não vá embora quando alguém sai da equipe. Ele foi pensado a partir das normas ISO 9001 e ISO 37001, o que me ensinou a transformar requisito escrito em regra de sistema.',
      'Fora do código, a parte que mais tenho desenvolvido é a de planejamento: quebrar um problema grande em partes, priorizar o que importa e [organizar o trabalho de uma equipe](#project-ROW_02). Agora estou estudando inteligência artificial e machine learning na faculdade, querendo entender não só como usar, mas quando vale a pena usar, e já apliquei isso em [um modelo de previsão de preços](#project-ROW_04).',
    ],
    valuesTitle: 'Como eu trabalho',
    values: [
      'Escuto o sintoma, mas procuro a causa: quem usa descreve o que incomoda, não o que está errado.',
      'Planejo antes de prototipar, com MoSCoW e EAP para decidir o que entra e o que fica de fora.',
      'Mudo de estratégia quando ela não está funcionando, mesmo depois de horas investidas nela.',
      'Construo pensando em quem vai usar sem precisar me chamar.',
    ],
    facts: [
      { key: 'localizacao', value: 'São José dos Pinhais · Grande Curitiba, PR' },
      { key: 'formacao', value: 'Ciência da Computação (em andamento)' },
      { key: 'atuacao', value: 'Estagiário de TI no GOB-PR (desde out/2025)' },
      { key: 'foco_atual', value: 'Python/Django, full stack e bancos de dados' },
      { key: 'aprendendo', value: 'Inteligência Artificial • Machine Learning' },
      { key: 'idiomas', value: 'Português (nativo) • Inglês (técnico) • Espanhol (básico)' },
    ],
  },

  projects: {
    title: 'Projetos',
    subtitle:
      'Projetos de software, trabalhos acadêmicos e iniciativas coletivas — com o contexto, o processo e o que ficou de cada um.',
    filterLabel: 'Filtrar projetos por categoria',
    categories: {
      todos: 'TODOS',
      software: 'SOFTWARE',
      hackathon: 'HACKATHON',
      academico: 'ACADÊMICO',
      social: 'SOCIAL / COLETIVO',
      experimento: 'EXPERIMENTOS',
    },
    imageAlt: (title) => `Interface do projeto ${title}`,
    meta: {
      where: 'onde',
      when: 'quando',
      role: 'meu papel',
      result: 'resultado',
    },
    viewProcess: 'Ver processo',
    hoverHint: 'Passe o mouse para detalhes',
    close: 'Fechar',
    gallery: {
      label: (title) => `Galeria de imagens do projeto ${title}`,
      imageAlt: (title, n, total) => `Interface do projeto ${title} (imagem ${n} de ${total})`,
      prev: 'Imagem anterior',
      next: 'Próxima imagem',
      goTo: (n) => `Ver imagem ${n}`,
      count: (n) => `${n} fotos`,
    },
    problemTitle: 'O problema',
    processTitle: 'Como foi o processo',
    learningsTitle: 'O que eu aprendi',
    links: {
      demo: 'VER DEMO',
      repo: 'REPOSITÓRIO',
    },
    items: {
      ROW_01: {
        title: 'Sistema de Rotinas - GOB/PR Digital',
        categoryLabel: 'Full Stack',
        period: 'Set/2026 - Atualmente',
        context: 'Grande Oriente do Brasil - Paraná - Estágio em TI',
        role: 'Desenvolvedor full-stack - modelagem, back-end em Django e interface',
        summary:
          'Queria que o conhecimento de como cada processo funciona não ficasse só na cabeça das pessoas. Construí em Django um sistema que documenta, versiona e publica as rotinas de cada secretaria, seguindo as normas ISO 9001 e ISO 37001.',
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
      },

      ROW_02: {
        title: 'Hackathon Recarga Inteligente - Localiza&Co',
        categoryLabel: 'Liderança',
        period: '21/Out/2026 - 11 horas (8h às 19h)',
        context:
          'Hackathon do processo seletivo de estágio da Localiza&Co - cerca de 90 participantes em 16+ equipes',
        role: 'Líder da equipe (5 pessoas) e responsável pelo planejamento e estratégia',
        result:
          'Top 10 geral, com cerca de 35 mil pontos (1º lugar com cerca de 37 mil); chegamos a ficar no top 4',
        summary:
          'O desafio era dimensionar a recarga de carros elétricos gastando o mínimo, com cada teste no simulador oficial custando caro. Liderei a equipe na construção de um motor próprio em Python para testar configurações antes de enviar, e terminamos no top 10.',
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
      },

      ROW_03: {
        title: 'Save Point',
        categoryLabel: 'Full Stack',
        period: 'Mar/2026 - Atualmente',
        context: 'Projeto acadêmico - Ciência da Computação (PUCPR) - executado localmente',
        role: 'Desenvolvedor full-stack - modelagem do banco, API e interface',
        summary:
          'Queria um lugar único para organizar o backlog de jogos espalhados entre plataformas. Modelei o banco em MySQL, criei uma API REST com Node.js/Express e a interface em React.',
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
      },

      ROW_04: {
        title: 'Skinomics - Previsão de Preços do Mercado da Steam',
        categoryLabel: 'Full Stack',
        period: 'Ago–Nov/2026 · 12 semanas',
        when: 'Ago–Nov/2026, 12 semanas (Go-Live em 13/11/2026)',
        context:
          'Projeto acadêmico da PUCPR - equipe de 4 pessoas, com plano de gestão completo (EAP, cronograma, 4 incrementos)',
        role: 'Responsável por dados e back-end; acabei implementando o sistema inteiro (API, banco, modelo, front-end e deploy) usando o Claude Code como par de programação',
        result:
          'Modelo com MAPE de 8,1% no teste (meta ≤ 15%), 21% menos erro que o baseline ingênuo; site no ar com login pela Steam',
        summary:
          'Plataforma web que coleta o histórico de preços de itens de Team Fortress 2 e usa machine learning para prever o preço da próxima semana. Fui responsável por dados e back-end e acabei construindo o sistema de ponta a ponta, do banco ao deploy, com um modelo que erra 21% menos que a previsão ingênua.',
        description:
          'Plataforma para investidores do mercado de itens da Steam: guarda o histórico diário de preço e volume, mostra tendências e prevê o preço de cada item para os próximos 7 dias, com uma interface própria inspirada no visual dos jogos da Valve.',
        problem:
          'O mercado da Steam movimenta itens que valem de centavos a centenas de dólares, mas o próprio site da Steam só mostra um gráfico simples. Quem compra para revender decide no achismo. O desafio era transformar um histórico ruidoso, com itens que mal são negociados, picos de manipulação e mudanças bruscas de regime, em previsões úteis e honestas.',
        process: [
          'Começamos testando CS2 e TF2. O modelo foi pior no CS2, então decidimos focar só em TF2 e fazer bem um mercado, em vez de mal os dois;',
          'Montei a base histórica em PostgreSQL com migrações versionadas (~90 mil preços diários de 37 itens, alguns desde 2012), com importação idempotente, deduplicação e descarte do dia parcial da coleta;',
          'No modelo, cada feature é relativa ao preço atual (retornos, distância de médias móveis, volatilidade, contexto do mercado), para comparar itens de US$ 0,15 e de US$ 10. Validei com split temporal e walk-forward de 4 semestres, nunca com divisão aleatória;',
          'Features de calendário (mês, dia do ano) melhoravam o treino mas quebravam no teste: o modelo decorava a sazonalidade antiga. Removi de propósito e cheguei a uma combinação de Gradient Boosting com média móvel exponencial, que ganhou do baseline ingênuo em 32 de 36 itens;',
          'Com o código começando a 2 semanas do Go-Live, priorizei o fluxo principal (dados → API → telas → deploy) e usei o Claude Code para acelerar a implementação, revisando cada decisão e mantendo testes automatizados no back-end;',
          'Coloquei no ar com front na Vercel, API em Docker no Render e banco no Neon, e implementei o login com a Steam via OpenID, com validação de assinatura, proteção contra login forjado e sessões guardadas só como hash.',
        ],
        learnings: [
          'Um modelo melhor no treino não é um modelo melhor: as features que mais "ajudavam" eram as que decoravam o passado, e só a validação por data mostrou isso;',
          'Baseline forte é obrigatório: a simples "volta para a média de 10 dias" já ganhava do ingênuo, e foi a régua para saber se o ML valia a pena;',
          'Cortar escopo também é engenharia: um mercado bem feito, e o fluxo principal antes dos módulos secundários, foi o que deixou o projeto no ar dentro do prazo;',
          'Segurança de login é cheia de detalhes: no OpenID, não basta a Steam dizer "válido", é preciso conferir quais campos estão dentro da assinatura;',
          'Programar com IA rende muito quando quem pilota entende o que está sendo feito: as decisões e a revisão continuam sendo trabalho de engenharia.',
        ],
        cardTags: ['Python', 'FastAPI', 'PostgreSQL', 'React + TypeScript', 'Machine Learning', 'Docker'],
        tags: ['Python', 'FastAPI', 'PostgreSQL', 'scikit-learn', 'React + TypeScript', 'Docker', 'Steam OpenID'],
      },
    },
  },

  skills: {
    title: 'Conhecimento Técnico',
    hint: 'Passe o mouse ou toque em uma tecnologia para ver onde usei.',
    usedInLabel: 'Usado em',
    groups: {
      languages: 'Linguagens',
      frontend: 'Front-end',
      backend: 'Back-end',
      data: 'Dados & ML',
      tools: 'Ferramentas',
    },
    usedIn: {
      savepoint: 'SAVE POINT',
      skinomics: 'SKINOMICS',
      portfolio: 'PORTFÓLIO',
      internship: 'ESTÁGIO',
      hackathon: 'HACKATHON',
      college: 'FACULDADE',
      all: 'TODOS OS PROJETOS',
    },
  },

  timeline: {
    title: 'Trajetória',
    subtitle: 'Do início da faculdade até hoje: estudo, trabalho e os projetos que marcaram cada etapa.',
    types: {
      education: 'Formação',
      work: 'Experiência',
      project: 'Projeto',
      course: 'Curso',
      hackathon: 'Hackathon',
    },
    ongoing: 'Em andamento',
    viewProject: 'Ver projeto',
    items: {
      pucpr: {
        date: '2024 – 2027',
        title: 'Bacharelado em Ciência da Computação',
        org: 'PUCPR - Pontifícia Universidade Católica do Paraná',
        description:
          'Início da graduação, com base em desenvolvimento de software, banco de dados e arquitetura de sistemas. Hoje no 6º semestre, estudando Inteligência Artificial, Machine Learning e programação distribuída.',
        tags: ['Programação OO', 'Banco de Dados', 'Desenvolvimento Web', 'IA / ML'],
      },
      gobpr: {
        date: 'Out/2025 – Atual',
        title: 'Estagiário de TI',
        org: 'Grande Oriente do Brasil - Paraná',
        description:
          'Entrei no suporte e na automação de planilhas e hoje desenvolvo [o sistema interno](#project-ROW_01) que documenta as rotinas de trabalho de todas as secretarias, construído em Python/Django sobre os requisitos das normas ISO 9001 e ISO 37001.',
        highlights: [
          'Desenvolvimento do Sistema de Rotinas: cadastro, versionamento, fluxo de aprovação e mapa visual de cada processo, com versão para impressão;',
          'Tradução dos requisitos da ISO 9001 e da ISO 37001 em regras do sistema: controle de documentos, histórico de versões, acesso por secretaria e autenticação em dois fatores;',
          'Automação de etapas repetitivas de processos administrativos com planilhas e scripts, reduzindo preenchimento manual e retrabalho;',
          'Implantação e configuração do GLPI, além de servidores de teste para aplicações;',
          'Desenvolvimento e manutenção de páginas web internas;',
          'Suporte aos usuários e ajuste das ferramentas a partir do uso real da equipe.',
        ],
        tags: ['Python', 'Django', 'ISO 9001', 'ISO 37001', 'Automação', 'GLPI', 'Suporte'],
      },
      savepoint: {
        date: 'Mar/2026',
        title: 'Save Point',
        org: 'Projeto acadêmico - PUCPR',
        description:
          'Plataforma full-stack para gamers organizarem o backlog de jogos, com API REST em Node.js/Express, banco MySQL e interface em React.',
        tags: ['React', 'Node.js', 'Express', 'MySQL'],
      },
      python: {
        date: '2026',
        title: 'Curso de Python 3 do básico ao avançado - com projetos reais',
        org: 'Udemy',
        description:
          'Curso com projetos reais para aprofundar Python, a linguagem que uso no estágio e que depois foi a base do hackathon.',
        tags: ['Python'],
      },
      skinomics: {
        date: 'Ago/2026 – Nov/2026',
        title: 'Skinomics - Previsão de Preços do Mercado da Steam',
        org: 'Projeto acadêmico - PUCPR',
        description:
          'Plataforma que guarda o histórico de preços de itens de Team Fortress 2 e prevê o preço da próxima semana com machine learning. Responsável por dados e back-end, construí o sistema de ponta a ponta, com um modelo que erra 21% menos que a previsão ingênua.',
        tags: ['Python', 'FastAPI', 'PostgreSQL', 'scikit-learn', 'Docker'],
      },
      rotinas: {
        date: 'Set/2026 – Atual',
        title: 'Sistema de Rotinas - GOB/PR Digital',
        org: 'GOB-PR - Estágio em TI',
        description:
          'Sistema web em Django que documenta, versiona e publica as rotinas de trabalho de cada secretaria, construído sobre os requisitos das normas ISO 9001 e ISO 37001.',
        tags: ['Python', 'Django', 'ISO 9001', 'ISO 37001'],
      },
      hackathon: {
        date: 'Out/2026',
        title: 'Hackathon Recarga Inteligente - Localiza&Co',
        org: 'Processo seletivo de estágio da Localiza&Co',
        description:
          'Liderei uma equipe de 5 pessoas no planejamento e na estratégia de um motor de simulação em Python. Terminamos no top 10 geral.',
        tags: ['Python', 'Liderança', 'Simulação'],
      },
    },
  },

  contact: {
    title: 'Bora construir algo juntos?',
    subtitle: 'Aberto a oportunidades de estágio, projetos e boas conversas sobre tecnologia.',
    copyEmail: 'Copiar e-mail',
    copied: 'E-mail copiado!',
    ping: [
      ['status', 'aberto a novas oportunidades'],
      ['local', 'Grande Curitiba, PR · UTC-3'],
      ['idiomas', 'PT · EN · ES'],
    ],
  },
};
