import { writable } from 'svelte/store';

const createCounterStore = () => {
  const counter = writable(0);

  const increment = () => counter.update(n => n + 1);
  const decrement = () => counter.update(n => n - 1);
  const reset = () => counter.set(0);

  return {
    subscribe: counter.subscribe,
    increment,
    decrement,
    reset,
  };
};

export const counter = createCounterStore();
