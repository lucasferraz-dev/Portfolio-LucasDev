import styles from './TypedText.module.css';

export default function TypedText({ tokens, typed, offset = 0, showCaret = true }) {
  let position = offset;

  return tokens.map((token, i) => {
    const start = position;
    const visibleCount = Math.min(Math.max(typed - start, 0), token.text.length);
    const hasCaret = showCaret && typed >= start && typed < start + token.text.length;
    position += token.text.length;

    return (
      <span key={i} className={token.className}>
        {token.text.slice(0, visibleCount)}
        {hasCaret && <span className={styles.caret} />}
        <span className={styles.ghost}>{token.text.slice(visibleCount)}</span>
      </span>
    );
  });
}
