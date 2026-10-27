import { useEffect, useState } from 'react';

export const tokensLength = (tokens) => tokens.reduce((total, token) => total + token.text.length, 0);

export default function useTypingProgress(total, { active, startDelay = 600, charDelay = 40 }) {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!active || typed >= total) return;
    const timer = setTimeout(() => setTyped((n) => n + 1), typed === 0 ? startDelay : charDelay);
    return () => clearTimeout(timer);
  }, [active, typed, total, startDelay, charDelay]);

  return Math.min(typed, total);
}
