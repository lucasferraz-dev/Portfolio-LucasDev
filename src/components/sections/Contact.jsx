import styles from './Contact.module.css';

const CONTACT_METHODS = [
  { id: '01', label: 'PROTOCOL: SMTP', value: 'lucasferrazsantos@hotmail.com', url: 'mailto:lucasferrazsantos@hotmail.com' },
  { id: '02', label: 'PROTOCOL: LINKEDIN', value: '@lucas-ferraz-bcc', url: 'https://www.linkedin.com/in/lucas-ferraz-bcc' },
  { id: '03', label: 'PROTOCOL: GITHUB', value: '@lucasferraz-dev', url: 'https://github.com/lucasferraz-dev' },
  { id: '04', label: 'PROTOCOL: WHATSAPP', value: '+55 (41) 98780-6543', url: 'https://wa.me/5541987806543' }
];

export default function Contact() {
  return (
    <section id="contact" className={styles.sectionContainer}>
      
      <div className={styles.header}>
        <span className={styles.tagline}>OPEN CONCURRENT_CONNECTIONS;</span>
        <h2 className={styles.sectionTitle}>Entre em contato</h2>
      </div>

      <div className={styles.grid}>
        {CONTACT_METHODS.map((method) => (
          <a key={method.id} href={method.url} target="_blank" rel="noreferrer" className={styles.card}>
            <div className={styles.cardContent}>
              <span className={styles.label}>{method.label}</span>
              <span className={styles.value}>{method.value}</span>
            </div>
            <span className={styles.arrow}>→</span>
          </a>
        ))}
      </div>

      <div className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <span className={styles.dot}></span>
          <h3 className={styles.statusTitle}>CLUSTER STATUS: ONLINE</h3>
        </div>
        <p className={styles.statusText}>
          Pronto para novas conexões, projetos e otimizações de sistemas de dados. Mande sua requisição.
        </p>
      </div>

    </section>
  );
}