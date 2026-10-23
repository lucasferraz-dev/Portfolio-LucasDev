import styles from './About.module.css';

const FACTS = [
  { key: 'localizacao', value: 'Curitiba, Paraná — Brasil' },
  { key: 'formacao', value: 'Ciência da Computação (em andamento)' },
  { key: 'atuacao', value: 'Estagiário de TI no GOB-PR (desde out/2025)' },
  { key: 'foco_atual', value: 'Python/Django, full stack e bancos de dados' },
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
            Comecei a programar querendo entender como as coisas que eu usava todos os dias funcionavam por trás. Hoje o que mais me prende é o outro lado: descobrir por que um processo não funciona antes de decidir o que construir.
          </p>

          <p className={styles.paragraph}>
            Estudo Ciência da Computação na PUCPR desde 2024 e, em outubro de 2025, entrei como estagiário de TI no Grande Oriente do Brasil - Paraná. Comecei no suporte e na automação de planilhas e hoje desenvolvo o sistema que guarda as rotinas de trabalho de cada secretaria, para que o conhecimento não vá embora quando alguém sai da equipe. Ele foi pensado a partir das normas ISO 9001 e ISO 37001, o que me ensinou a transformar requisito escrito em regra de sistema.
          </p>

          <p className={styles.paragraph}>
            Fora do código, a parte que mais tenho desenvolvido é a de planejamento: quebrar um problema grande em partes, priorizar o que importa e organizar o trabalho de uma equipe. Agora estou estudando inteligência artificial e machine learning na faculdade, querendo entender não só como usar, mas quando vale a pena usar.
          </p>

          <div className={styles.valuesBlock}>
            <h3 className={styles.valuesTitle}>Como eu trabalho</h3>
            <ul className={styles.valuesList}>
              <li className={styles.valueItem}>
                <span className={styles.bullet}>&gt;</span>
                Escuto o sintoma, mas procuro a causa: quem usa descreve o que incomoda, não o que está errado.
              </li>
              <li className={styles.valueItem}>
                <span className={styles.bullet}>&gt;</span>
                Planejo antes de prototipar, com MoSCoW e EAP para decidir o que entra e o que fica de fora.
              </li>
              <li className={styles.valueItem}>
                <span className={styles.bullet}>&gt;</span>
                Mudo de estratégia quando ela não está funcionando, mesmo depois de horas investidas nela.
              </li>
              <li className={styles.valueItem}>
                <span className={styles.bullet}>&gt;</span>
                Construo pensando em quem vai usar sem precisar me chamar.
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