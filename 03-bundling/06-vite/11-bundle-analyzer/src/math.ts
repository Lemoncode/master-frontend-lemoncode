const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const operate = (n: number): number => {
  const base = Math.min(n, randomBetween(0, 50));
  const multiplier = randomBetween(1, 15);
  return base + multiplier;
};
