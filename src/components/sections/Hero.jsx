import styles from './Hero.module.css';
import fotoPerfil from '../../assets/perfil.png'

export default function Hero() {
  return (
    <section className={styles.heroContainer}>
      
      <div className={styles.textBlock}>
        <div className={styles.tagline}>
          // database architecture & performance \\
        </div>
        
        <h1 className={styles.title}>
          Lucas Ferraz
        </h1>
        
        <h2 className={styles.subtitle}>
          Modelando arquiteturas de dados robustas e otimizando consultas de alta performance.
        </h2>
        
        <p className={styles.description}>
          Desenvolvedor de software focado em engenharia de dados, otimização de queries em sistemas relacionais e modelagem de ecossistemas escaláveis como o Save Point.
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
          <img src={fotoPerfil} alt="Lucas Ferraz" className={styles.profilePhoto} />
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
                <span className={styles.output}>&gt; Name:</span> <span className={styles.string}>'Lucas Ferraz'</span>
              </div>
              <div className={styles.dbLine}>
                <span className={styles.output}>&gt; Role:</span> <span className={styles.string}>'Software Developer'</span>
              </div>
              <div className={styles.dbLine}>
                <span className={styles.output}>&gt; Focus:</span> <span className={styles.string}>'Database Architecture'</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}