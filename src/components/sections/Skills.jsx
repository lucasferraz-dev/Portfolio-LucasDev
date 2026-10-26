import styles from './Skills.module.css';
import { useLanguage } from '../../i18n/useLanguage';

const SKILL_SCHEMAS = [
  {
    table: 'frontend_stack',
    type: 'Interface Layer',
    columns: [
      { name: 'React', usedIn: ['savepoint', 'portfolio'] },
      { name: 'JavaScript', usedIn: ['savepoint', 'portfolio'] },
      { name: 'Tailwind CSS', usedIn: ['portfolio'] },
      { name: 'HTML / CSS', usedIn: ['internship', 'portfolio'] }
    ]
  },

  {
    table: 'backend_runtime',
    type: 'Application Layer',
    columns: [
      { name: 'Python', usedIn: ['internship', 'hackathon'] },
      { name: 'Django', usedIn: ['internship'] },
      { name: 'Node.js', usedIn: ['savepoint'] },
      { name: 'Express', usedIn: ['savepoint'] },
      { name: 'REST APIs', usedIn: ['savepoint', 'hackathon'] }
    ]
  },

  {
    table: 'data_&_tools',
    type: 'Persistence & Versioning',
    columns: [
      { name: 'MySQL', usedIn: ['savepoint'] },
      { name: 'SQL Server', usedIn: ['savepoint'] },
      { name: 'SQLite', usedIn: ['college'] },
      { name: 'Git / GitHub', usedIn: ['all'] }
    ]
  }
];

export default function Skills() {
  const { t } = useLanguage();

  return (
    <section id="skills" className={styles.sectionContainer}>

      <div className={styles.header}>
        <span className={styles.tagline}>SHOW SCHEMAS;</span>
        <h2 className={styles.sectionTitle}>{t.skills.title}</h2>
      </div>

      <div className={styles.grid}>
        {SKILL_SCHEMAS.map((schema, index) => (
          <div key={index} className={styles.tableCard}>
            
            <div className={styles.tableHeader}>
              <div className={styles.titleGroup}>
                <span className={styles.tablePrefix}>[TB]</span>
                <h3 className={styles.tableName}>{schema.table}</h3>
              </div>
              <span className={styles.tableType}>{schema.type}</span>
            </div>

            <div className={styles.tableBody}>
              <div className={styles.columnsHeader}>
                <span>COLUMN_NAME</span>
                <span>USED_IN</span>
              </div>
              
              <div className={styles.rowsContainer}>
                {schema.columns.map((col, colIndex) => (
                  <div key={colIndex} className={styles.row}>
                    <span className={styles.fieldName}>{col.name}</span>
                    <span className={styles.fieldStatus}>
                      {col.usedIn.map((key) => t.skills.usedIn[key]).join(' · ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}