import { useState } from 'react';
import {
  siC,
  siCplusplus,
  siCss,
  siDjango,
  siExpress,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siMysql,
  siNodedotjs,
  siNumpy,
  siOpenjdk,
  siPandas,
  siPhp,
  siPython,
  siReact,
  siScikitlearn,
  siSqlalchemy,
  siSqlite,
  siTailwindcss,
  siVercel,
  siVite,
} from 'simple-icons';
import styles from './Skills.module.css';
import { useLanguage } from '../../i18n/useLanguage';

const SKILL_GROUPS = [
  {
    id: 'languages',
    skills: [
      { name: 'Python', icon: siPython, usedIn: ['internship', 'hackathon'] },
      { name: 'JavaScript', icon: siJavascript, usedIn: ['savepoint', 'portfolio'] },
      { name: 'Java', icon: siOpenjdk, usedIn: ['college'] },
      { name: 'C', icon: siC, usedIn: ['college'] },
      { name: 'C++', icon: siCplusplus, usedIn: ['college'] },
      { name: 'PHP', icon: siPhp, usedIn: ['college'] },
    ],
  },
  {
    id: 'frontend',
    skills: [
      { name: 'React', icon: siReact, usedIn: ['savepoint', 'portfolio'] },
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
      { name: 'REST APIs', monogram: 'API', usedIn: ['savepoint', 'hackathon'] },
    ],
  },
  {
    id: 'data',
    skills: [
      { name: 'MySQL', icon: siMysql, usedIn: ['savepoint'] },
      { name: 'SQL Server', monogram: 'SQL', usedIn: ['savepoint'] },
      { name: 'SQLite', icon: siSqlite, usedIn: ['college'] },
      { name: 'SQLAlchemy', icon: siSqlalchemy, usedIn: ['college'] },
      { name: 'pandas', icon: siPandas, usedIn: ['hackathon'] },
      { name: 'NumPy', icon: siNumpy, usedIn: ['hackathon'] },
      { name: 'scikit-learn', icon: siScikitlearn, usedIn: ['hackathon'] },
      { name: 'matplotlib', monogram: 'plt', usedIn: ['hackathon'] },
    ],
  },
  {
    id: 'tools',
    skills: [
      { name: 'Git', icon: siGit, usedIn: ['all'] },
      { name: 'GitHub', icon: siGithub, usedIn: ['all'] },
      { name: 'Vercel', icon: siVercel, usedIn: ['portfolio'] },
      { name: 'Excel', monogram: 'XLS', usedIn: ['internship'] },
      { name: 'GLPI', monogram: 'GLPI', usedIn: ['internship'] },
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

function SkillCard({ skill }) {
  const { t } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(false);
  const usedIn = skill.usedIn.map((key) => t.skills.usedIn[key]);

  return (
    <button
      type="button"
      className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
      onClick={() => setIsFlipped((prev) => !prev)}
      aria-label={`${skill.name}. ${t.skills.usedInLabel}: ${usedIn.join(', ')}`}
    >
      <span className={styles.inner}>
        <span className={`${styles.face} ${styles.front}`}>
          <SkillIcon skill={skill} />
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
          <div key={group.id} className={styles.group}>
            <h3 className={styles.groupTitle}>
              <span className={styles.groupPrefix}>[TB]</span> {t.skills.groups[group.id]}
            </h3>
            <div className={styles.grid}>
              {group.skills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
