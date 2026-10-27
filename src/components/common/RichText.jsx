import styles from './RichText.module.css';

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;
const PROJECT_HASH = /^#project-(.+)$/;

export const OPEN_PROJECT_EVENT = 'open-project';

export function KeywordLink({ href, children, className = styles.keyword }) {
  if (href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  const projectId = href.match(PROJECT_HASH)?.[1];

  const handleClick = (event) => {
    if (!projectId) return;
    event.preventDefault();
    window.history.replaceState(null, '', href);
    window.dispatchEvent(new CustomEvent(OPEN_PROJECT_EVENT, { detail: projectId }));
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

export default function RichText({ text }) {
  const parts = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const [fullMatch, label, href] = match;
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <KeywordLink key={match.index} href={href}>
        {label}
      </KeywordLink>
    );
    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return <span>{parts}</span>;
}
