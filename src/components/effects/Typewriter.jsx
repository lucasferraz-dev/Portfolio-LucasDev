import { useEffect, useState } from 'react';

const TYPE_DELAY = 75;
const DELETE_DELAY = 35;
const HOLD_DELAY = 1800;
const NEXT_DELAY = 400;

export default function Typewriter({ phrases, className, cursorClassName }) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrase = phrases[index];

  useEffect(() => {
    const isFull = !isDeleting && length === phrase.length;
    const isEmpty = isDeleting && length === 0;

    let delay = isDeleting ? DELETE_DELAY : TYPE_DELAY;
    if (isFull) delay = HOLD_DELAY;
    if (isEmpty) delay = NEXT_DELAY;

    const timer = setTimeout(() => {
      if (isFull) {
        setIsDeleting(true);
      } else if (isEmpty) {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % phrases.length);
      } else {
        setLength((prev) => prev + (isDeleting ? -1 : 1));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [length, isDeleting, phrase, phrases.length]);

  const visibleText = phrase.slice(0, length);

  return (
    <>
      <span className="sr-only">{phrases.join(', ')}</span>
      <span className={className} aria-hidden="true">{visibleText}</span>
      <span className={cursorClassName} aria-hidden="true">_</span>
    </>
  );
}
