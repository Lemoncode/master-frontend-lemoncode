import { readable } from 'svelte/store';

export const currentTime = readable(new Date(), set => {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);

  // return stop function
  return () => {
    clearInterval(interval);
  };
});
