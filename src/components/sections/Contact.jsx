import { useEffect, useState } from 'react';
import { siGithub, siWhatsapp } from 'simple-icons';
import styles from './Contact.module.css';
import { useLanguage } from '../../i18n/useLanguage';
import TypedText from '../effects/TypedText';
import useInView from '../effects/useInView';
import useTypingProgress, { tokensLength } from '../effects/useTypingProgress';

const EMAIL = 'lucasferrazsantos@hotmail.com';

const LINKEDIN_PATH =
  'M4 9h3.2v11H4zM5.6 3.6a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8zM9.4 9h3v1.5c.5-.9 1.7-1.8 3.5-1.8 3.2 0 3.9 2.1 3.9 4.9V20h-3.2v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V20H9.4z';

const LINKS = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/lucas-ferraz-bcc', path: LINKEDIN_PATH },
  { label: 'GitHub', url: 'https://github.com/lucasferraz-dev', path: siGithub.path },
  { label: 'WhatsApp', url: 'https://wa.me/5541987806543', path: siWhatsapp.path },
];

const PING_TOKENS = [{ text: 'ping lucas' }];
const PING_LENGTH = tokensLength(PING_TOKENS);
const ROW_DELAY = 260;

function MailIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function CopyIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </svg>
  );
}

function PingTerminal({ rows }) {
  const [cardRef, inView] = useInView(0.5);
  const typed = useTypingProgress(PING_LENGTH, { active: inView, startDelay: 500, charDelay: 70 });
  const [revealed, setRevealed] = useState(0);

  const isTyping = typed < PING_LENGTH;
  const isDone = revealed >= rows.length;

  useEffect(() => {
    if (isTyping || isDone) return;
    const timer = setTimeout(() => setRevealed((n) => n + 1), ROW_DELAY);
    return () => clearTimeout(timer);
  }, [isTyping, isDone, revealed]);

  return (
    <div ref={cardRef} className={styles.terminal}>
      <div className={styles.terminalHeader}>
        <span className={styles.terminalDot} />
        <span className={styles.terminalDot} />
        <span className={styles.terminalDot} />
        <span className={styles.terminalTitle}>terminal</span>
      </div>

      <p className="sr-only">{rows.map(([key, value]) => `${key}: ${value}`).join(', ')}</p>

      <div className={styles.terminalBody} aria-hidden="true">
        <div className={styles.terminalLine}>
          <span className={styles.prompt}>$</span>
          <TypedText tokens={PING_TOKENS} typed={typed} showCaret={isTyping} />
        </div>

        {rows.map(([key, value], i) => (
          <div key={key} className={`${styles.terminalLine} ${revealed > i ? '' : styles.pending}`}>
            <span className={styles.pingKey}>{key}:</span>
            <span className={styles.pingValue}>{value}</span>
          </div>
        ))}

        <div className={`${styles.terminalLine} ${isDone ? '' : styles.pending}`}>
          <span className={styles.prompt}>$</span>
          <span className={styles.caret} />
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const { lang, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const field = document.createElement('textarea');
      field.value = EMAIL;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    setCopied(true);
  };

  return (
    <section id="contact" className={styles.sectionContainer}>
      <div className={styles.header}>
        <span className={styles.tagline}>OPEN CONCURRENT_CONNECTIONS;</span>
        <h2 className={styles.sectionTitle}>{t.contact.title}</h2>
        <p className={styles.subtitle}>{t.contact.subtitle}</p>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.emailButton} onClick={copyEmail} aria-label={t.contact.copyEmail}>
          <MailIcon className={styles.strokeIcon} />
          <span className={styles.emailText}>{EMAIL}</span>
          <CopyIcon className={`${styles.strokeIcon} ${styles.copyIcon}`} />
        </button>

        <p className={`${styles.copied} ${copied ? styles.copiedVisible : ''}`} aria-live="polite">
          {copied ? `✓ ${t.contact.copied}` : ''}
        </p>

        <div className={styles.links}>
          {LINKS.map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className={styles.link}>
              <svg viewBox="0 0 24 24" className={styles.linkIcon} aria-hidden="true">
                <path d={link.path} fill="currentColor" />
              </svg>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <PingTerminal key={lang} rows={t.contact.ping} />
    </section>
  );
}
