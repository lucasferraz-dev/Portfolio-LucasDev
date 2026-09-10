import styles from './About.module.css';

const FACTS = [
  { key: 'localizacao', value: 'Curitiba, Paraná — Brasil' },
  { key: 'formacao', value: 'Ciência da Computação (em andamento)' },
  { key: 'atuacao', value: 'Estagiário de TI • Desenvolvimento web' },
  { key: 'foco_atual', value: 'Full stack, automação e bancos de dados' },
  { key: 'aprendendo', value: 'Inteligência Artificial • Machine Learning' },
  { key: 'idiomas', value: 'Português (nativo) • Inglês (técnico)' },
];

export default function About() {
  return (
    <section id="about" className={styles.sectionContainer}>
      <div className={styles.header}>
        <span className={styles.tagline}>SELECT * FROM about_me;</span>
        <h2 className={styles.sectionTitle}>Quem eu sou</h2>
      </div>

      <div className={styles.layout}>
        <div className={styles.textColumn}>
          <p className={styles.lead}>
            Comecei a programar querendo entender como as coisas que eu usava todos os dias funcionavam por trás. Com o tempo, programação deixou de ser apenas uma ferramenta e passou a ser uma forma de transformar problemas em soluções.
          </p>

          <p className={styles.paragraph}>
            Sou estudante de Ciência da Computação e venho construindo minha experiência através de projetos acadêmicos, projetos pessoais e da minha atuação profissional em TI. Já trabalhei com desenvolvimento web, bancos de dados, automação e suporte, explorando diferentes áreas para entender onde posso criar mais valor.
          </p>

          <p className={styles.paragraph}>
            Atualmente, meu foco está em desenvolvimento de software e full stack. Gosto especialmente de aprender construindo, testar ideias e entender o motivo por trás das decisões técnicas.
          </p>

          <div className={styles.valuesBlock}>
            <h3 className={styles.valuesTitle}>Como eu trabalho</h3>
            <ul className={styles.valuesList}>
              <li className={styles.valueItem}>
                <span className={styles.bullet}>&gt;</span>
                Entender problemas antes de começar a desenvolver.

              </li>
              <li className={styles.valueItem}>
                <span className={styles.bullet}>&gt;</span>
                Aprender na prática através de projetos e experimentação.
              </li>
              <li className={styles.valueItem}>
                <span className={styles.bullet}>&gt;</span>
                Explorar diferentes tecnologias para encontrar soluções.
              </li>
              <li className={styles.valueItem}>
                <span className={styles.bullet}>&gt;</span>
                Trabalhar em equipe e transformar ideias em produtos.
              </li>
            </ul>
          </div>
        </div>

        <aside className={styles.factsCard}>
          <div className={styles.factsHeader}>
            <span className={styles.factsFile}>profile_record.json</span>
          </div>
          <div className={styles.factsBody}>
            <span className={styles.brace}>{'{'}</span>
            {FACTS.map((fact) => (
              <div key={fact.key} className={styles.factRow}>
                <span className={styles.factKey}>&quot;{fact.key}&quot;</span>
                <span className={styles.colon}>:</span>
                <span className={styles.factValue}>&quot;{fact.value}&quot;</span>
              </div>
            ))}
            <span className={styles.brace}>{'}'}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}