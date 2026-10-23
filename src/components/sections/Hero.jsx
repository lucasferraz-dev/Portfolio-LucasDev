import styles from './Hero.module.css';
import fotoPerfil from '../../assets/perfil.jfif'

export default function Hero() {
  return (
    <section className={styles.heroContainer}>
      
      <div className={styles.textBlock}>
        <div className={styles.tagline}>
          // SOFTWARE DEVELOPMENT & PROBLEM SOLVING \\
        </div>
        
        <h1 className={styles.title}>
          Lucas Ferraz dos Santos
        </h1>
        
        <h2 className={styles.subtitle}>
          Desenvolvedor de software, com experiência em aplicações web, sistemas internos e automação de processos.
        </h2>

        <p className={styles.description}>
          Estudante de Ciência da Computação na PUCPR e estagiário de TI, trabalhando com Python, Django, React e bancos de dados.
        </p>
        
        <div className={styles.ctaGroup}>
          <a href="#projects" className={styles.primaryBtn}>
            Ver Projetos
          </a>
          <a href="#contact" className={styles.secondaryBtn}>
            Contato
          </a>
        </div>
      </div>

      <div className={styles.visualContainer}>
        <div className={styles.photoFrame}>
          <img src={fotoPerfil} alt="Lucas Ferraz dos Santos" className={styles.profilePhoto} />
        </div>
        
        <div className={styles.dbStatusCard}>
          <div className={styles.dbHeader}>
            <span className={styles.dbTitle}>developer_query.sql</span>
          </div>
          <div className={styles.dbContent}>
            <div className={styles.dbLine}>
              <span className={styles.keyword}>SELECT</span> name, role, focus <span className={styles.keyword}>FROM</span> developers <span className={styles.keyword}>WHERE</span> id = <span className={styles.string}>'lucas_ferraz'</span>;
            </div>
            <div className={styles.dbResult}>
              <div className={styles.dbLine}>
                <span className={styles.output}>&gt; Name:</span> <span className={styles.string}>'Lucas Ferraz dos Santos'</span>
              </div>
              <div className={styles.dbLine}>
                <span className={styles.output}>&gt; Role:</span> <span className={styles.string}>'Estagiário de TI @ GOB-PR'</span>
              </div>
              <div className={styles.dbLine}>
                <span className={styles.output}>&gt; Focus:</span> <span className={styles.string}>'Python · Django · React'</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}