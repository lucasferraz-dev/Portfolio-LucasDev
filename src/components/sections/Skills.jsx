import { useState } from 'react';
import {
  siC,
  siCplusplus,
  siContentful,
  siCss,
  siDjango,
  siDocker,
  siExpress,
  siFastapi,
  siGit,
  siGithub,
  siGrafana,
  siHtml5,
  siJavascript,
  siLinear,
  siMysql,
  siNeon,
  siNodedotjs,
  siNumpy,
  siOpenjdk,
  siPandas,
  siPhp,
  siPostgresql,
  siPython,
  siReact,
  siRender,
  siScikitlearn,
  siSqlalchemy,
  siSqlite,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
  siWikidotjs,
} from 'simple-icons';
import styles from './Skills.module.css';
import useInView from '../effects/useInView';
import { useLanguage } from '../../i18n/useLanguage';

const SKILL_GROUPS = [
  {
    id: 'languages',
    skills: [
      { name: 'Python', icon: siPython, anim: 'slither', usedIn: ['internship', 'hackathon', 'skinomics'] },
      { name: 'JavaScript', icon: siJavascript, anim: 'pop', usedIn: ['savepoint', 'portfolio'] },
      { name: 'TypeScript', icon: siTypescript, anim: 'flip', usedIn: ['skinomics'] },
      { name: 'Java', icon: siOpenjdk, anim: 'steam', usedIn: ['college'] },
      { name: 'C', icon: siC, anim: 'flip', usedIn: ['college'] },
      { name: 'C++', icon: siCplusplus, anim: 'flip', usedIn: ['college'] },
      { name: 'PHP', icon: siPhp, anim: 'swing', usedIn: ['college'] },
    ],
  },
  {
    id: 'frontend',
    skills: [
      { name: 'React', icon: siReact, anim: 'spin', usedIn: ['savepoint', 'portfolio', 'skinomics'] },
      { name: 'HTML', icon: siHtml5, anim: 'drop', usedIn: ['internship', 'portfolio'] },
      { name: 'CSS', icon: siCss, anim: 'jelly', usedIn: ['internship', 'portfolio'] },
      { name: 'Tailwind CSS', icon: siTailwindcss, anim: 'wave', usedIn: ['portfolio'] },
      { name: 'Vite', icon: siVite, anim: 'zap', usedIn: ['portfolio'] },
    ],
  },
  {
    id: 'backend',
    skills: [
      { name: 'Node.js', icon: siNodedotjs, anim: 'bounce', usedIn: ['savepoint'] },
      { name: 'Express', icon: siExpress, anim: 'zap', usedIn: ['savepoint'] },
      { name: 'Django', icon: siDjango, anim: 'drop', usedIn: ['internship'] },
      { name: 'FastAPI', icon: siFastapi, anim: 'zap', usedIn: ['skinomics'] },
      { name: 'REST APIs', monogram: 'API', anim: 'type', usedIn: ['savepoint', 'hackathon', 'skinomics'] },
    ],
  },
  {
    id: 'data',
    skills: [
      { name: 'PostgreSQL', icon: siPostgresql, anim: 'stack', usedIn: ['skinomics'] },
      { name: 'MySQL', icon: siMysql, anim: 'swing', usedIn: ['savepoint'] },
      { name: 'SQL Server', monogram: 'SQL', anim: 'type', usedIn: ['savepoint'] },
      { name: 'SQLite', icon: siSqlite, anim: 'stack', usedIn: ['college'] },
      { name: 'SQLAlchemy', icon: siSqlalchemy, anim: 'flip', usedIn: ['college'] },
      { name: 'pandas', icon: siPandas, anim: 'bounce', usedIn: ['hackathon'] },
      { name: 'NumPy', icon: siNumpy, anim: 'grow', usedIn: ['hackathon'] },
      { name: 'scikit-learn', icon: siScikitlearn, anim: 'pop', usedIn: ['skinomics', 'hackathon'] },
      { name: 'matplotlib', monogram: 'plt', anim: 'type', usedIn: ['hackathon'] },
    ],
  },
  {
    id: 'tools',
    skills: [
      { name: 'Git', icon: siGit, anim: 'branch', usedIn: ['all'] },
      { name: 'GitHub', icon: siGithub, anim: 'pop', usedIn: ['all'] },
      { name: 'Docker', icon: siDocker, anim: 'float', usedIn: ['skinomics'] },
      { name: 'Vercel', icon: siVercel, anim: 'drop', usedIn: ['portfolio', 'skinomics'] },
      { name: 'Render', icon: siRender, anim: 'grow', usedIn: ['skinomics'] },
      { name: 'Neon', icon: siNeon, anim: 'pulse', usedIn: ['skinomics'] },
      { name: 'Excel', monogram: 'XLS', anim: 'type', usedIn: ['internship'] },
      { name: 'GLPI', monogram: 'GLPI', anim: 'type', usedIn: ['internship'] },
      { name: 'Linear', icon: siLinear, anim: 'spin', usedIn: ['internship'] },
      { name: 'Wiki.js', icon: siWikidotjs, anim: 'page', usedIn: ['internship'] },
      { name: 'Contentful', icon: siContentful, anim: 'pop', usedIn: ['internship'] },
      { name: 'Zabbix', monogram: 'ZBX', anim: 'pulse', usedIn: ['internship'] },
      { name: 'Grafana', icon: siGrafana, anim: 'grow', usedIn: ['internship'] },
    ],
  },
];

const isDarkColor = (hex) => {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 70;
};

function SkillIcon({ skill }) {
  if (!skill.icon) return <span className={styles.monogram}>{skill.monogram}</span>;

  const isDark = isDarkColor(skill.icon.hex);

  return (
    <svg
      viewBox="0 0 24 24"
      className={`${styles.icon} ${isDark ? styles.iconDark : ''}`}
      style={isDark ? undefined : { color: `#${skill.icon.hex}` }}
      aria-hidden="true"
    >
      <path d={skill.icon.path} fill="currentColor" />
    </svg>
  );
}

function SkillCard({ skill, index }) {
  const { t } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(false);
  const usedIn = skill.usedIn.map((key) => t.skills.usedIn[key]);

  return (
    <button
      type="button"
      className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
      style={{ '--delay': `${index * 70}ms` }}
      onClick={() => setIsFlipped((prev) => !prev)}
      aria-label={`${skill.name}. ${t.skills.usedInLabel}: ${usedIn.join(', ')}`}
    >
      <span className={styles.inner}>
        <span className={`${styles.face} ${styles.front}`}>
          <span className={`${styles.iconWrap} ${styles[`anim-${skill.anim}`]}`}>
            <SkillIcon skill={skill} />
          </span>
          <span className={styles.name}>{skill.name}</span>
        </span>

        <span className={`${styles.face} ${styles.back}`}>
          <span className={styles.backLabel}>{t.skills.usedInLabel}</span>
          {usedIn.map((label) => (
            <span key={label} className={styles.usedItem}>{label}</span>
          ))}
        </span>
      </span>
    </button>
  );
}

function SkillGroup({ group, title }) {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className={`${styles.group} ${inView ? styles.revealed : ''}`}>
      <h3 className={styles.groupTitle}>
        <span className={styles.groupPrefix}>[TB]</span> {title}
      </h3>
      <div className={styles.grid}>
        {group.skills.map((skill, index) => (
          <SkillCard key={skill.name} skill={skill} index={index} />
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const { t } = useLanguage();

  return (
    <section id="skills" className={styles.sectionContainer}>
      <div className={styles.header}>
        <span className={styles.tagline}>SHOW SCHEMAS;</span>
        <h2 className={styles.sectionTitle}>{t.skills.title}</h2>
        <p className={styles.hint}>{t.skills.hint}</p>
      </div>

      <div className={styles.groups}>
        {SKILL_GROUPS.map((group) => (
          <SkillGroup key={group.id} group={group} title={t.skills.groups[group.id]} />
        ))}
      </div>
    </section>
  );
}
