export default {
  meta: {
    title: 'Lucas Ferraz dos Santos | Software Developer',
    description:
      'Portfolio of Lucas Ferraz dos Santos — Computer Science student and software developer. Software projects, automation and databases.',
  },

  app: {
    skipLink: 'Skip to content',
  },

  header: {
    nav: {
      about: 'About',
      projects: 'Projects',
      skills: 'Skills',
      journey: 'Journey',
      contact: 'Contact',
    },
    mainNav: 'Main navigation',
    mobileNav: 'Mobile navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    lightMode: 'Switch to light mode',
    darkMode: 'Switch to dark mode',
  },

  hero: {
    typedPrefix: 'i build',
    typedPhrases: ['web systems', 'internal tools', 'automations', 'REST APIs', 'solutions to real problems'],
    subtitle:
      'Software developer with experience in web applications, internal systems and process automation.',
    description:
      'Computer Science student at PUCPR and IT intern, working with Python, Django, React and databases.',
    ctaProjects: 'View Projects',
    ctaContact: 'Contact',
    ctaResume: 'Download Resume',
    resumeFile: '/cv/Curriculo_LucasF_EN.pdf',
    scrollHint: 'Scroll to explore',
    role: 'IT Intern @ GOB-PR',
  },

  about: {
    title: 'Who I am',
    lead: 'I started programming because I wanted to understand how the things I used every day worked behind the scenes. Today, what grips me most is the other side: figuring out why a process isn’t working before deciding what to build.',
    paragraphs: [
      'I’ve been studying Computer Science at PUCPR since 2024, and in October 2025 I joined Grande Oriente do Brasil - Paraná as an IT intern. I started in user support and spreadsheet automation, and today I develop [the system that stores each department’s work routines](#project-ROW_01), so that knowledge doesn’t walk out the door when someone leaves the team. It was designed around the ISO 9001 and ISO 37001 standards, which taught me how to turn written requirements into system rules.',
      'Beyond code, the skill I’ve been developing the most is planning: breaking a big problem into parts, prioritizing what matters and [organizing a team’s work](#project-ROW_02). I’m now studying artificial intelligence and machine learning in college, aiming to understand not only how to use them, but when they’re worth using.',
    ],
    valuesTitle: 'How I work',
    values: [
      'I listen to the symptom, but look for the cause: users describe what bothers them, not what is wrong.',
      'I plan before prototyping, using MoSCoW and a WBS to decide what’s in and what’s out.',
      'I change strategy when it isn’t working, even after hours invested in it.',
      'I build for people who should be able to use it without having to call me.',
    ],
    facts: [
      { key: 'location', value: 'São José dos Pinhais · Greater Curitiba, PR' },
      { key: 'education', value: 'Computer Science (in progress)' },
      { key: 'position', value: 'IT Intern at GOB-PR (since Oct/2025)' },
      { key: 'current_focus', value: 'Python/Django, full stack and databases' },
      { key: 'learning', value: 'Artificial Intelligence • Machine Learning' },
      { key: 'languages', value: 'Portuguese (native) • English (technical) • Spanish (basic)' },
    ],
  },

  projects: {
    title: 'Projects',
    subtitle:
      'Software projects, academic work and collective initiatives — with the context, the process and the takeaways from each one.',
    filterLabel: 'Filter projects by category',
    categories: {
      todos: 'ALL',
      software: 'SOFTWARE',
      hackathon: 'HACKATHON',
      academico: 'ACADEMIC',
      social: 'SOCIAL / COLLECTIVE',
      experimento: 'EXPERIMENTS',
    },
    imageAlt: (title) => `Interface of the ${title} project`,
    meta: {
      where: 'where',
      when: 'when',
      role: 'my role',
      result: 'result',
    },
    viewProcess: 'See process',
    hoverHint: 'Hover for details',
    close: 'Close',
    problemTitle: 'The problem',
    processTitle: 'How the process went',
    learningsTitle: 'What I learned',
    links: {
      demo: 'WATCH DEMO',
      repo: 'REPOSITORY',
    },
    items: {
      ROW_01: {
        title: 'Routines System - GOB/PR Digital',
        categoryLabel: 'Full Stack',
        period: 'Sep/2026 - Present',
        context: 'Grande Oriente do Brasil - Paraná - IT Internship',
        role: 'Full-stack developer - data modeling, Django back end and interface',
        summary:
          'I wanted the knowledge of how each process works to stop living only in people’s heads. I built a Django system that documents, versions and publishes each department’s routines, following the ISO 9001 and ISO 37001 standards.',
        description:
          'Web system for registering, versioning and looking up each department’s work routines, presenting every process as a visual map of steps with inputs and outputs. Built on the requirements of the ISO 9001 (quality management) and ISO 37001 (anti-bribery management system) standards.',
        problem:
          'Knowledge of how each process worked was concentrated in people. When someone left or the team was reorganized, there was no single, simple and reliable place to check who performs each step, what they receive and what they deliver.',
        process: [
          'I studied the requirements of ISO 9001 (process approach and control of documented information) and ISO 37001 (controls, traceability and responsibilities) and translated them into system rules;',
          'Together with each department, I mapped how routines were carried out and defined a standard format: steps with an input (who performs it, what they receive) and an output (to whom, what they deliver);',
          'I modeled departments, routines, versions and steps, with a standardized code per department (e.g. ADM-001);',
          'I implemented the routine lifecycle: drafting, approval and publication, with history and new versions created without losing the current one, meeting the document control required by the standards;',
          'I built the visual process map and a printable version, for quick reference by non-technical staff;',
          'I added per-department access control, public routines (read-only for everyone) and two-factor authentication (authenticator app, backup codes and email).',
        ],
        learnings: [
          'Documenting processes only works if looking something up is easier than asking someone;',
          'A standard becomes software when each requirement becomes a concrete rule: who approves, what gets recorded and who can see it;',
          'Versioning and an approval flow are what give confidence that the published information is the current one;',
          'Django greatly speeds up building internal systems: authentication, the admin and the ORM cover much of the foundation.',
        ],
        tags: ['Python', 'Django', 'Databases', 'MFA', 'ISO 9001', 'ISO 37001'],
      },

      ROW_02: {
        title: 'Smart Charging Hackathon - Localiza&Co',
        categoryLabel: 'Leadership',
        period: 'Oct 21, 2026 - 11 hours (8 am to 7 pm)',
        context:
          'Hackathon in Localiza&Co’s internship selection process - around 90 participants in 16+ teams',
        role: 'Team leader (5 people), responsible for planning and strategy',
        result:
          'Top 10 overall, with about 35k points (1st place had about 37k); we reached the top 4 at one point',
        summary:
          'The challenge was sizing EV charging at the lowest cost, with every test on the official simulator being expensive. I led the team in building our own Python engine to test configurations before submitting, and we finished in the top 10.',
        description:
          'Python simulation engine that estimated the score of each configuration of fictional electric car rental branches (chargers, power supply, contracted demand and charging policy) before submitting it to the event’s official simulator.',
        problem:
          'Each branch had to serve as many customers as possible while spending as little as possible on infrastructure and power. The score came from an official simulator (the "judge"), but every query and every resubmission cost limited coins, the scoring weights were hidden during the first half of the day, and the final score was calculated over weeks that no team could see.',
        process: [
          'Without a laptop of my own (there were 3 laptops for 5 people, one of them with a faulty network card), I took on the planning and, since I proposed most of the ideas, ended up becoming the group’s leader;',
          'I organized the work with MoSCoW and a WBS, identified the core problems of the challenge and defined the strategy; everything the team implemented went through me to be approved or, at least, understood;',
          'We built an engine that simulated the score from the configuration JSON. Since its results often diverged from the judge’s, it was calibrated and improved continuously throughout the day;',
          'We started out trying to apply machine learning. After 3 hours without results, I made the call to drop that approach and switch to a brute-force script on top of our engine, which worked much better, especially after the weights were revealed;',
          'I was the bridge to the mentors, presenting our strategy and clearing up questions, and toward the end I took turns replacing the developers so they could rest while I kept testing and improving.',
        ],
        learnings: [
          'Knowing when to change strategy: dropping 3 hours of ML work was the hardest decision of the day, and also the one that paid off the most;',
          'Architecture and planning matter as much as prototyping, and a reliable in-house model saves resources you don’t get back (each resubmission cost double the previous one);',
          'Leading means holding back fatigue and anxiety so they don’t spread to the team, taking the criticism and keeping the group delivering even with limited resources;',
          'Clearly explaining concepts like MoSCoW, WBS and business strategy to the team, and our strategy to the mentors, is as much part of the job as writing code;',
          'Consistency is a result too: while some teams dropped as low as -120k points, we stayed in the top 10 all day long.',
        ],
        tags: ['Python', 'Simulation', 'Brute Force', 'Leadership', 'Planning', 'MoSCoW / WBS'],
      },

      ROW_03: {
        title: 'Save Point',
        categoryLabel: 'Full Stack',
        period: 'Mar/2026 - Present',
        context: 'Academic project - Computer Science (PUCPR) - runs locally',
        role: 'Full-stack developer - database modeling, API and interface',
        summary:
          'I wanted a single place to organize a game backlog spread across platforms. I modeled the MySQL database, built a REST API with Node.js/Express and the React interface.',
        description:
          'Full-stack platform for gamers to organize their backlog, manage their profiles and compare the experience across different games and versions.',
        problem:
          'Players pile up dozens of unfinished games spread across different platforms and have no single place to track what they’ve played, what they’ve dropped and what’s worth picking back up.',
        process: [
          'I modeled the relational database (users, games, versions, progress status) before writing any screen;',
          'I built the REST API with Node.js + Express and integrated an external game catalog API;',
          'I developed the React front end consuming the API, prioritizing the listing and status changes as the main flow;',
          'I recorded a demo walking through the system, since it runs locally and hasn’t been deployed.',
        ],
        learnings: [
          'Modeling the data first saves rework: almost every screen change I avoided came from a well-thought-out schema;',
          'Integrating third-party APIs means treating failures and rate limits as the rule, not the exception.',
        ],
        tags: ['React', 'Node.js', 'MySQL', 'Express', 'API Integration'],
      },
    },
  },

  skills: {
    title: 'Technical Skills',
    hint: 'Hover or tap a technology to see where I used it.',
    usedInLabel: 'Used in',
    groups: {
      languages: 'Languages',
      frontend: 'Front-end',
      backend: 'Back-end',
      data: 'Data & ML',
      tools: 'Tools',
    },
    usedIn: {
      savepoint: 'SAVE POINT',
      portfolio: 'PORTFOLIO',
      internship: 'INTERNSHIP',
      hackathon: 'HACKATHON',
      college: 'COLLEGE',
      all: 'ALL PROJECTS',
    },
  },

  timeline: {
    title: 'Journey',
    subtitle: 'From the start of college to today: studies, work and the projects that marked each stage.',
    types: {
      education: 'Education',
      work: 'Experience',
      project: 'Project',
      course: 'Course',
      hackathon: 'Hackathon',
    },
    ongoing: 'In progress',
    viewProject: 'View project',
    items: {
      pucpr: {
        date: '2024 – 2027',
        title: 'Bachelor’s in Computer Science',
        org: 'PUCPR - Pontifical Catholic University of Paraná',
        description:
          'Start of my degree, built on software development, databases and systems architecture. Now in the 6th semester, studying Artificial Intelligence, Machine Learning and distributed programming.',
        tags: ['OOP', 'Databases', 'Web Development', 'AI / ML'],
      },
      gobpr: {
        date: 'Oct/2025 – Present',
        title: 'IT Intern',
        org: 'Grande Oriente do Brasil - Paraná',
        description:
          'I started in user support and spreadsheet automation, and today I develop [the internal system](#project-ROW_01) that documents the work routines of every department, built with Python/Django on the requirements of the ISO 9001 and ISO 37001 standards.',
        highlights: [
          'Development of the Routines System: registration, versioning, approval flow and a visual map of each process, with a printable version;',
          'Translating ISO 9001 and ISO 37001 requirements into system rules: document control, version history, per-department access and two-factor authentication;',
          'Automating repetitive steps of administrative processes with spreadsheets and scripts, reducing manual data entry and rework;',
          'Deployment and configuration of GLPI, plus test servers for applications;',
          'Development and maintenance of internal web pages;',
          'User support and tool adjustments based on how the team actually uses them.',
        ],
        tags: ['Python', 'Django', 'ISO 9001', 'ISO 37001', 'Automation', 'GLPI', 'Support'],
      },
      savepoint: {
        date: 'Mar/2026',
        title: 'Save Point',
        org: 'Academic project - PUCPR',
        description:
          'Full-stack platform for gamers to organize their game backlog, with a REST API in Node.js/Express, a MySQL database and a React interface.',
        tags: ['React', 'Node.js', 'Express', 'MySQL'],
      },
      python: {
        date: '2026',
        title: 'Curso de Python 3 do básico ao avançado - com projetos reais',
        org: 'Udemy',
        description:
          'Course with real projects to deepen my Python, the language I use at my internship and that later powered the hackathon.',
        tags: ['Python'],
      },
      rotinas: {
        date: 'Sep/2026 – Present',
        title: 'Routines System - GOB/PR Digital',
        org: 'GOB-PR - IT Internship',
        description:
          'Django web system that documents, versions and publishes each department’s work routines, built on the requirements of the ISO 9001 and ISO 37001 standards.',
        tags: ['Python', 'Django', 'ISO 9001', 'ISO 37001'],
      },
      hackathon: {
        date: 'Oct/2026',
        title: 'Smart Charging Hackathon - Localiza&Co',
        org: 'Localiza&Co internship selection process',
        description:
          'I led a team of 5 in the planning and strategy of a Python simulation engine. We finished in the overall top 10.',
        tags: ['Python', 'Leadership', 'Simulation'],
      },
    },
  },

  contact: {
    title: 'Let’s build something together?',
    subtitle: 'Open to internship opportunities, projects and good conversations about tech.',
    copyEmail: 'Copy email',
    copied: 'Email copied!',
    ping: [
      ['status', 'open to new opportunities'],
      ['location', 'Greater Curitiba, PR · UTC-3'],
      ['languages', 'PT · EN · ES'],
    ],
  },
};
