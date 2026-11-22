import { useEffect, useRef, useState } from 'react';
import { usePresenting } from './presentation';

/*
 * Marca quando o elemento entra na tela. Por padrão é uma vez só.
 * Com { replay: true }, durante o modo apresentação (modo TV ou tour) ele também
 * desmarca ao sair da tela, para a animação rodar de novo na próxima entrada.
 */
export default function useInView(threshold = 0.4, { replay = false } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const presenting = usePresenting();
  const repeat = replay && presenting;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (repeat) {
          setInView(entry.isIntersecting);
          return;
        }
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, repeat]);

  return [ref, inView];
}
