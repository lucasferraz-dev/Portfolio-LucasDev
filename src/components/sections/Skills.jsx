import styles from './Skills.module.css';

const SKILL_SCHEMAS = [
  {
    table: 'frontend_stack',
    type: 'Interface Layer',
    columns: [
      { name: 'React', status: 'ACTIVE' },
      { name: 'JavaScript', status: 'ACTIVE' },
      { name: 'Tailwind CSS', status: 'STYLED' },
      { name: 'HTML / CSS', status: 'RENDERED' }
    ]
  },

  {
    table: 'backend_runtime',
    type: 'Application Layer',
    columns: [
      { name: 'Node.js', status: 'ACTIVE' },
      { name: 'Express', status: 'ACTIVE' },
      { name: 'Python', status: 'ACTIVE' },
      { name: 'REST APIs', status: 'CONNECTED' }
    ]
  },

  {
    table: 'data_storage',
    type: 'Persistence Layer',
    columns: [
      { name: 'MySQL', status: 'PRIMARY KEY' },
      { name: 'SQL Server', status: 'INDEXED' },
      { name: 'SQLite', status: 'OPTIMIZED' },
      { name: 'GitHub', status: 'MODELED' }
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
                <span>ATTRIBUTES</span>
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