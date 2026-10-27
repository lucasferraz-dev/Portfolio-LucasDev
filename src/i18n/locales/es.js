export default {
  meta: {
    title: 'Lucas Ferraz dos Santos | Desarrollador de Software',
    description:
      'Portafolio de Lucas Ferraz dos Santos — estudiante de Ciencias de la Computación y desarrollador de software. Proyectos de software, automatización y bases de datos.',
  },

  app: {
    skipLink: 'Saltar al contenido',
  },

  header: {
    nav: {
      about: 'Sobre mí',
      projects: 'Proyectos',
      skills: 'Skills',
      journey: 'Trayectoria',
      contact: 'Contacto',
    },
    mainNav: 'Navegación principal',
    mobileNav: 'Navegación móvil',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    language: 'Idioma',
    lightMode: 'Activar modo claro',
    darkMode: 'Activar modo oscuro',
  },

  hero: {
    typedPrefix: 'construyo',
    typedPhrases: ['sistemas web', 'sistemas internos', 'automatizaciones', 'APIs REST', 'soluciones a problemas reales'],
    subtitle:
      'Desarrollador de software, con experiencia en aplicaciones web, sistemas internos y automatización de procesos.',
    description:
      'Estudiante de Ciencias de la Computación en la PUCPR y pasante de TI, trabajando con Python, Django, React y bases de datos.',
    ctaProjects: 'Ver Proyectos',
    ctaContact: 'Contacto',
    ctaResume: 'Descargar CV',
    resumeFile: '/cv/Curriculo_LucasF_ES.pdf',
    scrollHint: 'Desliza para explorar',
    role: 'Pasante de TI @ GOB-PR',
  },

  about: {
    title: 'Quién soy',
    lead: 'Empecé a programar porque quería entender cómo funcionaban por dentro las cosas que usaba todos los días. Hoy lo que más me atrapa es el otro lado: descubrir por qué un proceso no funciona antes de decidir qué construir.',
    paragraphs: [
      'Estudio Ciencias de la Computación en la PUCPR desde 2024 y, en octubre de 2025, entré como pasante de TI en el Grande Oriente do Brasil - Paraná. Empecé en soporte y en la automatización de planillas, y hoy desarrollo [el sistema que guarda las rutinas de trabajo de cada secretaría](#project-ROW_01), para que el conocimiento no se vaya cuando alguien deja el equipo. Fue pensado a partir de las normas ISO 9001 e ISO 37001, lo que me enseñó a transformar un requisito escrito en una regla del sistema.',
      'Más allá del código, lo que más he desarrollado es la planificación: dividir un problema grande en partes, priorizar lo que importa y [organizar el trabajo de un equipo](#project-ROW_02). Ahora estoy estudiando inteligencia artificial y machine learning en la universidad, con el objetivo de entender no solo cómo usarlos, sino cuándo vale la pena hacerlo.',
    ],
    valuesTitle: 'Cómo trabajo',
    values: [
      'Escucho el síntoma, pero busco la causa: quien usa describe lo que le molesta, no lo que está mal.',
      'Planifico antes de prototipar, con MoSCoW y EDT para decidir qué entra y qué queda afuera.',
      'Cambio de estrategia cuando no está funcionando, incluso después de horas invertidas en ella.',
      'Construyo pensando en quien lo va a usar sin necesidad de llamarme.',
    ],
    facts: [
      { key: 'ubicacion', value: 'Curitiba, Paraná — Brasil' },
      { key: 'formacion', value: 'Ciencias de la Computación (en curso)' },
      { key: 'puesto', value: 'Pasante de TI en GOB-PR (desde oct/2025)' },
      { key: 'enfoque_actual', value: 'Python/Django, full stack y bases de datos' },
      { key: 'aprendiendo', value: 'Inteligencia Artificial • Machine Learning' },
      { key: 'idiomas', value: 'Portugués (nativo) • Inglés (técnico)' },
    ],
  },

  projects: {
    title: 'Proyectos',
    subtitle:
      'Proyectos de software, trabajos académicos e iniciativas colectivas — con el contexto, el proceso y lo que me dejó cada uno.',
    filterLabel: 'Filtrar proyectos por categoría',
    categories: {
      todos: 'TODOS',
      software: 'SOFTWARE',
      hackathon: 'HACKATHON',
      academico: 'ACADÉMICO',
      social: 'SOCIAL / COLECTIVO',
      experimento: 'EXPERIMENTOS',
    },
    imageAlt: (title) => `Interfaz del proyecto ${title}`,
    meta: {
      where: 'dónde',
      when: 'cuándo',
      role: 'mi rol',
      result: 'resultado',
    },
    viewProcess: 'Ver proceso',
    hoverHint: 'Pasa el cursor para ver más',
    close: 'Cerrar',
    problemTitle: 'El problema',
    processTitle: 'Cómo fue el proceso',
    learningsTitle: 'Lo que aprendí',
    links: {
      demo: 'VER DEMO',
      repo: 'REPOSITORIO',
    },
    items: {
      ROW_01: {
        title: 'Sistema de Rutinas - GOB/PR Digital',
        categoryLabel: 'Full Stack',
        period: 'Sep/2026 - Actualidad',
        context: 'Grande Oriente do Brasil - Paraná - Pasantía en TI',
        role: 'Desarrollador full-stack - modelado, back-end en Django e interfaz',
        summary:
          'Quería que el conocimiento de cómo funciona cada proceso no quedara solo en la cabeza de las personas. Construí en Django un sistema que documenta, versiona y publica las rutinas de cada secretaría, siguiendo las normas ISO 9001 e ISO 37001.',
        description:
          'Sistema web para registrar, versionar y consultar las rutinas de trabajo de cada secretaría, presentando cada proceso como un mapa visual de etapas con entradas y salidas. Desarrollado con base en los requisitos de las normas ISO 9001 (gestión de la calidad) e ISO 37001 (sistema de gestión antisoborno).',
        problem:
          'El conocimiento sobre cómo funcionaba cada proceso estaba concentrado en las personas. Cuando alguien se iba o el equipo se reorganizaba, no había un lugar único, simple y confiable para consultar quién ejecuta cada etapa, qué recibe y qué entrega.',
        process: [
          'Estudié los requisitos de la ISO 9001 (enfoque por procesos y control de la información documentada) y de la ISO 37001 (controles, trazabilidad y responsabilidades) y los traduje en reglas del sistema;',
          'Mapeé junto a las secretarías cómo se ejecutaban las rutinas y definí un formato estándar: etapas con entrada (quién ejecuta, qué recibe) y salida (para quién, qué entrega);',
          'Modelé secretarías, rutinas, versiones y etapas, con un código estandarizado por secretaría (ej.: ADM-001);',
          'Implementé el ciclo de vida de la rutina: en elaboración, aprobación y publicación, con historial y creación de nuevas versiones sin perder la vigente, cumpliendo con el control de documentos exigido por las normas;',
          'Construí el mapa visual del proceso y una versión para imprimir, para consulta rápida por quien no es técnico;',
          'Agregué control de acceso por secretaría, rutinas públicas (solo lectura para todos) y autenticación de dos factores (app autenticadora, códigos de respaldo y correo electrónico).',
        ],
        learnings: [
          'Documentar procesos solo funciona si consultar es más fácil que preguntarle a alguien;',
          'Una norma se convierte en software cuando cada requisito se vuelve una regla concreta: quién aprueba, qué queda registrado y quién puede verlo;',
          'El versionado y el flujo de aprobación son lo que da confianza de que la información publicada es la vigente;',
          'Django acelera mucho el desarrollo de sistemas internos: la autenticación, el admin y el ORM resuelven buena parte de la base.',
        ],
        tags: ['Python', 'Django', 'Bases de Datos', 'MFA', 'ISO 9001', 'ISO 37001'],
      },

      ROW_02: {
        title: 'Hackathon Recarga Inteligente - Localiza&Co',
        categoryLabel: 'Liderazgo',
        period: '21/Oct/2026 - 11 horas (8h a 19h)',
        context:
          'Hackathon del proceso de selección de pasantías de Localiza&Co - cerca de 90 participantes en más de 16 equipos',
        role: 'Líder del equipo (5 personas) y responsable de la planificación y la estrategia',
        result:
          'Top 10 general, con cerca de 35 mil puntos (el 1.º lugar tuvo cerca de 37 mil); llegamos a estar en el top 4',
        summary:
          'El desafío era dimensionar la recarga de autos eléctricos gastando lo mínimo, con cada prueba en el simulador oficial costando caro. Lideré al equipo en la construcción de un motor propio en Python para probar configuraciones antes de enviarlas, y terminamos en el top 10.',
        description:
          'Motor de simulación en Python que estimaba la puntuación de cada configuración de agencias ficticias de alquiler de autos eléctricos (cargadores, acometida eléctrica, demanda contratada y política de recarga) antes de enviarla al simulador oficial del evento.',
        problem:
          'Cada agencia tenía que atender al máximo de clientes gastando lo mínimo en infraestructura y potencia. La puntuación venía de un simulador oficial (el "juez"), pero cada consulta y cada reenvío costaban monedas limitadas, los pesos de la puntuación estuvieron ocultos durante la primera mitad del día y la nota final se calculaba en semanas que ningún equipo veía.',
        process: [
          'Sin notebook propio (había 3 notebooks para 5 personas, uno de ellos con la placa de red defectuosa), asumí la planificación y, como propuse la mayor parte de las ideas, terminé convirtiéndome en el líder del grupo;',
          'Organicé el trabajo con MoSCoW y EDT, identifiqué los problemas centrales del desafío y definí la estrategia; todo lo que el equipo implementaba pasaba por mí para ser aprobado o, al menos, entendido;',
          'Construimos un motor que simulaba la puntuación a partir del JSON de configuración. Como los resultados muchas veces diferían de los del juez, fue calibrado y mejorado continuamente a lo largo del día;',
          'Empezamos intentando aplicar machine learning. Después de 3 horas sin resultados, tomé la decisión de abandonar ese enfoque y pasar a un script de fuerza bruta sobre nuestro motor, que funcionó mucho mejor, sobre todo después de que se revelaron los pesos;',
          'Hice de puente con los mentores, presentando nuestra estrategia y aclarando dudas, y al final reemplacé a los desarrolladores por turnos, para que descansaran mientras yo seguía con las pruebas y mejoras.',
        ],
        learnings: [
          'Saber cuándo cambiar de estrategia: abandonar 3 horas de trabajo en ML fue la decisión más difícil del día y también la que más rindió;',
          'La arquitectura y la planificación pesan tanto como el prototipado, y un modelo propio confiable ahorra recursos que no vuelven (cada reenvío costaba el doble del anterior);',
          'Liderar es contener el cansancio y la ansiedad para no contagiar al equipo, asumir las críticas y mantener al grupo entregando incluso con recursos limitados;',
          'Explicar bien conceptos como MoSCoW, EDT y estrategia de negocio al equipo, y nuestra estrategia a los mentores, es parte del trabajo tanto como escribir código;',
          'La consistencia también es un resultado: mientras algunos equipos llegaron a -120 mil puntos, nos mantuvimos en el top 10 todo el día.',
        ],
        tags: ['Python', 'Simulación', 'Fuerza Bruta', 'Liderazgo', 'Planificación', 'MoSCoW / EDT'],
      },

      ROW_03: {
        title: 'Save Point',
        categoryLabel: 'Full Stack',
        period: 'Mar/2026 - Actualidad',
        context: 'Proyecto académico - Ciencias de la Computación (PUCPR) - ejecutado localmente',
        role: 'Desarrollador full-stack - modelado de la base de datos, API e interfaz',
        summary:
          'Quería un lugar único para organizar el backlog de juegos repartidos entre plataformas. Modelé la base de datos en MySQL, creé una API REST con Node.js/Express y la interfaz en React.',
        description:
          'Plataforma full-stack para que los gamers organicen su backlog, gestionen sus perfiles y comparen la experiencia de distintos juegos y versiones.',
        problem:
          'Los jugadores acumulan decenas de juegos sin terminar repartidos entre distintas plataformas y no tienen un lugar único para seguir lo que ya jugaron, lo que abandonaron y lo que vale la pena retomar.',
        process: [
          'Modelé la base de datos relacional (usuarios, juegos, versiones, estado de progreso) antes de escribir cualquier pantalla;',
          'Construí la API REST en Node.js + Express e integré una API externa de catálogo de juegos;',
          'Desarrollé el front-end en React consumiendo la API, priorizando el listado y el cambio de estado como flujo principal;',
          'Grabé una demo recorriendo el sistema, ya que se ejecuta localmente y no fue publicado.',
        ],
        learnings: [
          'Modelar los datos primero ahorra retrabajo: casi todo cambio de pantalla que evité vino de un schema bien pensado;',
          'Integrar APIs de terceros exige tratar las fallas y los límites de solicitudes como la regla, no como la excepción.',
        ],
        tags: ['React', 'Node.js', 'MySQL', 'Express', 'API Integration'],
      },
    },
  },

  skills: {
    title: 'Conocimientos Técnicos',
    usedIn: {
      savepoint: 'SAVE POINT',
      portfolio: 'PORTAFOLIO',
      internship: 'PASANTÍA',
      hackathon: 'HACKATHON',
      college: 'UNIVERSIDAD',
      all: 'TODOS LOS PROYECTOS',
    },
  },

  timeline: {
    title: 'Trayectoria',
    subtitle: 'Desde el inicio de la universidad hasta hoy: estudios, trabajo y los proyectos que marcaron cada etapa.',
    types: {
      education: 'Formación',
      work: 'Experiencia',
      project: 'Proyecto',
      course: 'Curso',
      hackathon: 'Hackathon',
    },
    ongoing: 'En curso',
    viewProject: 'Ver proyecto',
    items: {
      pucpr: {
        date: '2024 – 2027',
        title: 'Licenciatura en Ciencias de la Computación',
        org: 'PUCPR - Pontificia Universidad Católica de Paraná',
        description:
          'Inicio de la carrera, con base en desarrollo de software, bases de datos y arquitectura de sistemas. Hoy en el 6.º semestre, estudiando Inteligencia Artificial, Machine Learning y programación distribuida.',
        tags: ['POO', 'Bases de Datos', 'Desarrollo Web', 'IA / ML'],
      },
      gobpr: {
        date: 'Oct/2025 – Actualidad',
        title: 'Pasante de TI',
        org: 'Grande Oriente do Brasil - Paraná',
        description:
          'Entré en soporte y en la automatización de planillas, y hoy desarrollo [el sistema interno](#project-ROW_01) que documenta las rutinas de trabajo de todas las secretarías, construido en Python/Django sobre los requisitos de las normas ISO 9001 e ISO 37001.',
        highlights: [
          'Desarrollo del Sistema de Rutinas: registro, versionado, flujo de aprobación y mapa visual de cada proceso, con versión para imprimir;',
          'Traducción de los requisitos de la ISO 9001 y de la ISO 37001 en reglas del sistema: control de documentos, historial de versiones, acceso por secretaría y autenticación de dos factores;',
          'Automatización de etapas repetitivas de procesos administrativos con planillas y scripts, reduciendo la carga manual y el retrabajo;',
          'Implementación y configuración de GLPI, además de servidores de prueba para aplicaciones;',
          'Desarrollo y mantenimiento de páginas web internas;',
          'Soporte a los usuarios y ajuste de las herramientas a partir del uso real del equipo.',
        ],
        tags: ['Python', 'Django', 'ISO 9001', 'ISO 37001', 'Automatización', 'GLPI', 'Soporte'],
      },
      savepoint: {
        date: 'Mar/2026',
        title: 'Save Point',
        org: 'Proyecto académico - PUCPR',
        description:
          'Plataforma full-stack para que los gamers organicen su backlog de juegos, con API REST en Node.js/Express, base de datos MySQL e interfaz en React.',
        tags: ['React', 'Node.js', 'Express', 'MySQL'],
      },
      python: {
        date: '2026',
        title: 'Curso de Python 3 do básico ao avançado - com projetos reais',
        org: 'Udemy',
        description:
          'Curso con proyectos reales para profundizar en Python, el lenguaje que uso en la pasantía y que luego fue la base del hackathon.',
        tags: ['Python'],
      },
      rotinas: {
        date: 'Sep/2026 – Actualidad',
        title: 'Sistema de Rutinas - GOB/PR Digital',
        org: 'GOB-PR - Pasantía en TI',
        description:
          'Sistema web en Django que documenta, versiona y publica las rutinas de trabajo de cada secretaría, construido sobre los requisitos de las normas ISO 9001 e ISO 37001.',
        tags: ['Python', 'Django', 'ISO 9001', 'ISO 37001'],
      },
      hackathon: {
        date: 'Oct/2026',
        title: 'Hackathon Recarga Inteligente - Localiza&Co',
        org: 'Proceso de selección de pasantías de Localiza&Co',
        description:
          'Lideré un equipo de 5 personas en la planificación y la estrategia de un motor de simulación en Python. Terminamos en el top 10 general.',
        tags: ['Python', 'Liderazgo', 'Simulación'],
      },
    },
  },

  contact: {
    title: 'Ponte en contacto',
    statusText: 'Siempre abierto a nuevos desafíos, proyectos y oportunidades para aprender construyendo.',
  },
};
