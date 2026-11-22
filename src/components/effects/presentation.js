import { useSyncExternalStore } from 'react';

/*
 * “Modo apresentação”: fica ligado enquanto o modo TV ou o tour estão abertos.
 * Nele, as animações que normalmente rodam uma vez só (mascotes das skills,
 * ícones do Como eu trabalho) voltam a rodar toda vez que entram na tela.
 * É um contador para o modo TV e o tour poderem ligar ao mesmo tempo.
 */
let count = 0;
const listeners = new Set();

const notify = () => listeners.forEach((listener) => listener());

export function startPresenting() {
  count += 1;
  notify();
  let stopped = false;
  return () => {
    if (stopped) return;
    stopped = true;
    count -= 1;
    notify();
  };
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function usePresenting() {
  return useSyncExternalStore(subscribe, () => count > 0);
}
