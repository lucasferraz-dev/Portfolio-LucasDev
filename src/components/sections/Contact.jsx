import { useEffect, useRef, useState } from 'react';
import { siGithub, siWhatsapp } from 'simple-icons';
import styles from './Contact.module.css';
import { useLanguage } from '../../i18n/useLanguage';
import TypedText from '../effects/TypedText';
import useInView from '../effects/useInView';
import TerminalWindow from '../common/TerminalWindow';
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

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    document.execCommand('copy');
    field.remove();
  }
}

const COMMANDS = ['help', 'email', 'linkedin', 'github', 'whatsapp', 'cv', 'whoami', 'clear'];
const CHIPS = ['help', 'email', 'linkedin', 'github', 'cv'];
const LINK_COMMANDS = { linkedin: 'LinkedIn', github: 'GitHub', whatsapp: 'WhatsApp' };

/*
 * Terminal do contato. Primeiro roda um “ping lucas” com o status, o local e os
 * idiomas; depois vira um shell de verdade: dá para digitar comandos (help,
 * email, linkedin, github, whatsapp, cv, whoami, clear e um easter egg com sudo),
 * completar com Tab e voltar aos anteriores com a seta para cima. No celular,
 * os botões embaixo rodam os comandos mais comuns.
 */
function ContactShell({ rows }) {
  const { t } = useLanguage();
  const shell = t.contact.shell;
  const [cardRef, inView] = useInView(0.5);
  const typed = useTypingProgress(PING_LENGTH, { active: inView, startDelay: 500, charDelay: 70 });
  const [revealed, setRevealed] = useState(0);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [cleared, setCleared] = useState(false);
  const recall = useRef({ list: [], index: -1 });
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const isTyping = typed < PING_LENGTH;
  const isReady = revealed >= rows.length;

  useEffect(() => {
    if (isTyping || isReady) return;
    const timer = setTimeout(() => setRevealed((n) => n + 1), ROW_DELAY);
    return () => clearTimeout(timer);
  }, [isTyping, isReady, revealed]);

  // mantém a última linha à vista quando aparece saída nova
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [history, revealed]);

  const run = (raw) => {
    const command = raw.trim();
    const name = command.toLowerCase().split(/\s+/)[0];
    if (!command) return;

    recall.current = { list: [command, ...recall.current.list], index: -1 };

    if (name === 'clear') {
      setHistory([]);
      setCleared(true);
      return;
    }

    let output;
    if (name === 'help') output = shell.help;
    else if (name === 'email') {
      copyToClipboard(EMAIL);
      output = [`${shell.emailCopied} ${EMAIL}`];
    } else if (LINK_COMMANDS[name]) {
      const link = LINKS.find((item) => item.label === LINK_COMMANDS[name]);
      window.open(link.url, '_blank', 'noopener');
      output = [shell.opening(link.label)];
    } else if (name === 'cv') {
      window.open(t.hero.resumeFile, '_blank', 'noopener');
      output = [shell.cv];
    } else if (name === 'whoami') output = [shell.whoami];
    else if (name === 'sudo') output = [shell.sudo];
    else output = [shell.notFound(name)];

    setHistory((lines) => [...lines, { command, output }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    run(input);
    setInput('');
  };

  const handleKeyDown = (event) => {
    const { list, index } = recall.current;
    if (event.key === 'ArrowUp' && list.length) {
      event.preventDefault();
      const next = Math.min(index + 1, list.length - 1);
      recall.current.index = next;
      setInput(list[next]);
    } else if (event.key === 'ArrowDown' && index >= 0) {
      event.preventDefault();
      const next = index - 1;
      recall.current.index = next;
      setInput(next >= 0 ? list[next] : '');
    } else if (event.key === 'Tab' && input) {
      const match = COMMANDS.find((command) => command.startsWith(input.toLowerCase()));
      if (match) {
        event.preventDefault();
        setInput(match);
      }
    }
  };

  const prompt = (
    <span className={styles.promptLabel}>
      <span className={styles.promptUser}>{shell.user}@lucas</span>
      <span className={styles.promptPath}>:~$</span>
    </span>
  );

  return (
    <TerminalWindow
      ref={cardRef}
      title="ping lucas — zsh"
      app="zsh"
      status={shell.status}
      statusRight="UTF-8"
      className={styles.terminal}
      bodyClassName={styles.terminalBody}
    >
      <p className="sr-only">{rows.map(([key, value]) => `${key}: ${value}`).join(', ')}</p>

      <div ref={bodyRef} className={styles.screen} onClick={() => inputRef.current?.focus({ preventScroll: true })}>
        {!cleared && (
          <div aria-hidden="true">
            <div className={styles.terminalLine}>
              {prompt}
              <TypedText tokens={PING_TOKENS} typed={typed} showCaret={isTyping} />
            </div>
            {rows.map(([key, value], i) => (
              <div key={key} className={`${styles.terminalLine} ${revealed > i ? '' : styles.pending}`}>
                <span className={styles.pingKey}>{key}</span>
                <span className={styles.pingValue}>{value}</span>
              </div>
            ))}
            <div className={`${styles.terminalLine} ${styles.hint} ${isReady ? '' : styles.pending}`}>{shell.hint}</div>
          </div>
        )}

        <div aria-live="polite">
          {history.map((entry, i) => (
            <div key={i} className={styles.entry}>
              <div className={styles.terminalLine}>
                {prompt}
                <span className={styles.typedCommand}>{entry.command}</span>
              </div>
              {entry.output.map((line) => (
                <div key={line} className={`${styles.terminalLine} ${styles.outputLine}`}>{line}</div>
              ))}
            </div>
          ))}
        </div>

        <form className={`${styles.terminalLine} ${styles.inputLine} ${isReady ? '' : styles.pending}`} onSubmit={handleSubmit}>
          {prompt}
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={shell.placeholder}
            aria-label={shell.inputLabel}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={!isReady}
          />
        </form>
      </div>

      <div className={`${styles.chips} ${isReady ? '' : styles.pending}`}>
        {CHIPS.map((command) => (
          <button key={command} type="button" className={styles.chip} onClick={() => run(command)} disabled={!isReady}>
            {command}
          </button>
        ))}
      </div>
    </TerminalWindow>
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
    await copyToClipboard(EMAIL);
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

      <ContactShell key={lang} rows={t.contact.ping} />
    </section>
  );
}
