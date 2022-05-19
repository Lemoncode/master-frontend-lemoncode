export function getAvg(scores: number[]) {
  return getTotalScore(scores) / scores.length;
}

export function getTotalScore(scores: number[]) {
  return scores.reduce((score, count) => score + count);
}

console.log(`Api base: ${process.env.API_BASE}`);
