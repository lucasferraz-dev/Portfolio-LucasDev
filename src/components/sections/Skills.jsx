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
import SkillArt from './SkillArt';
import { useLanguage } from '../../i18n/useLanguage';

// glow: os mascotes ganham card preto com o ícone branco e um brilho na cor da marca.
const SKILL_GROUPS = [
  {
    id: 'languages',
    skills: [
      { name: 'Python', icon: siPython, glow: '#4B8BBE', usedIn: ['internship', 'hackathon', 'skinomics'] },
      { name: 'JavaScript', icon: siJavascript, usedIn: ['savepoint', 'portfolio'] },
      { name: 'TypeScript', icon: siTypescript, usedIn: ['skinomics'] },
      { name: 'Java', icon: siOpenjdk, glow: '#E76F00', usedIn: ['college'] },
      { name: 'C', icon: siC, usedIn: ['college'] },
      { name: 'C++', icon: siCplusplus, usedIn: ['college'] },
      { name: 'PHP', icon: siPhp, usedIn: ['college'] },
    ],
  },
  {
    id: 'frontend',
    skills: [
      { name: 'React', icon: siReact, usedIn: ['savepoint', 'portfolio', 'skinomics'] },
      { name: 'HTML', icon: siHtml5, usedIn: ['internship', 'portfolio'] },
      { name: 'CSS', icon: siCss, usedIn: ['internship', 'portfolio'] },
      { name: 'Tailwind CSS', icon: siTailwindcss, usedIn: ['portfolio'] },
      { name: 'Vite', icon: siVite, usedIn: ['portfolio'] },
    ],
  },
  {
    id: 'backend',
    skills: [
      { name: 'Node.js', icon: siNodedotjs, usedIn: ['savepoint'] },
      { name: 'Express', icon: siExpress, usedIn: ['savepoint'] },
      { name: 'Django', icon: siDjango, usedIn: ['internship'] },
      { name: 'FastAPI', icon: siFastapi, usedIn: ['skinomics'] },
      { name: 'REST APIs', monogram: 'API', usedIn: ['savepoint', 'hackathon', 'skinomics'] },
    ],
  },
  {
    id: 'data',
    skills: [
      { name: 'PostgreSQL', icon: siPostgresql, glow: '#4169E1', usedIn: ['skinomics'] },
      { name: 'MySQL', icon: siMysql, glow: '#F29111', usedIn: ['savepoint'] },
      { name: 'SQL Server', monogram: 'SQL', usedIn: ['savepoint'] },
      { name: 'SQLite', icon: siSqlite, usedIn: ['college'] },
      { name: 'SQLAlchemy', icon: siSqlalchemy, usedIn: ['college'] },
      { name: 'pandas', icon: siPandas, usedIn: ['hackathon'] },
      { name: 'NumPy', icon: siNumpy, usedIn: ['hackathon'] },
      { name: 'scikit-learn', icon: siScikitlearn, usedIn: ['skinomics', 'hackathon'] },
      { name: 'matplotlib', monogram: 'plt', usedIn: ['hackathon'] },
    ],
  },
  {
    id: 'tools',
    skills: [
      { name: 'Git', icon: siGit, usedIn: ['all'] },
      { name: 'GitHub', icon: siGithub, glow: '#8B949E', usedIn: ['all'] },
      { name: 'Docker', icon: siDocker, glow: '#2496ED', usedIn: ['skinomics'] },
      { name: 'Vercel', icon: siVercel, usedIn: ['portfolio', 'skinomics'] },
      { name: 'Render', icon: siRender, usedIn: ['skinomics'] },
      { name: 'Neon', icon: siNeon, usedIn: ['skinomics'] },
      { name: 'Excel', monogram: 'XLS', usedIn: ['internship'] },
      { name: 'GLPI', monogram: 'GLPI', usedIn: ['internship'] },
      { name: 'Linear', icon: siLinear, usedIn: ['internship'] },
      { name: 'Wiki.js', icon: siWikidotjs, glow: '#1976D2', usedIn: ['internship'] },
      { name: 'Contentful', icon: siContentful, usedIn: ['internship'] },
      { name: 'Zabbix', monogram: 'ZBX', usedIn: ['internship'] },
      { name: 'Grafana', icon: siGrafana, usedIn: ['internship'] },
      { name: 'Azure', monogram: 'AZ', usedIn: ['internship'] },
    ],
  },
];

function SkillCard({ skill, index }) {
  const { t } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(false);
  const usedIn = skill.usedIn.map((key) => t.skills.usedIn[key]);
  const spotlight = Boolean(skill.glow);

  return (
    <button
      type="button"
      className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
      style={{ '--delay': `${index * 70}ms` }}
      onClick={() => setIsFlipped((prev) => !prev)}
      aria-label={`${skill.name}. ${t.skills.usedInLabel}: ${usedIn.join(', ')}`}
    >
      <span className={styles.inner}>
        <span
          className={`${styles.face} ${styles.front} ${spotlight ? styles.spotlight : ''}`}
          style={spotlight ? { '--glow': skill.glow } : undefined}
        >
          <SkillArt skill={skill} />
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
    <div ref={ref} className={`${styles.group} ${inView ? `${styles.revealed} is-revealed` : ''}`}>
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
