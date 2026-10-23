import styles from './Skills.module.css';

const SKILL_SCHEMAS = [
  {
    table: 'frontend_stack',
    type: 'Interface Layer',
    columns: [
      { name: 'React', status: 'SAVE POINT · PORTFÓLIO' },
      { name: 'JavaScript', status: 'SAVE POINT · PORTFÓLIO' },
      { name: 'Tailwind CSS', status: 'PORTFÓLIO' },
      { name: 'HTML / CSS', status: 'ESTÁGIO · PORTFÓLIO' }
    ]
  },

  {
    table: 'backend_runtime',
    type: 'Application Layer',
    columns: [
      { name: 'Python', status: 'ESTÁGIO · HACKATHON' },
      { name: 'Django', status: 'ESTÁGIO' },
      { name: 'Node.js', status: 'SAVE POINT' },
      { name: 'Express', status: 'SAVE POINT' },
      { name: 'REST APIs', status: 'SAVE POINT · HACKATHON' }
    ]
  },

  {
    table: 'data_and_tools',
    type: 'Persistence & Versioning',
    columns: [
      { name: 'MySQL', status: 'SAVE POINT' },
      { name: 'SQL Server', status: 'SAVE POINT' },
      { name: 'SQLite', status: 'FACULDADE' },
      { name: 'Git / GitHub', status: 'TODOS OS PROJETOS' }
    ]
  }
];

export default function Skills() {
  return (
    <section id="skills" className={styles.sectionContainer}>
      
      <div className={styles.header}>
        <span className={styles.tagline}>SHOW SCHEMAS;</span>
        <h2 className={styles.sectionTitle}>Conhecimento Técnico</h2>
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
                    <span className={styles.fieldStatus}>{col.status}</span>
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