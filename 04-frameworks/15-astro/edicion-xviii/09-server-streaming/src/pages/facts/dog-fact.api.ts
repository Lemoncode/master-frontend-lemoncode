export async function getDogFact() {
  await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate 5s delay
  return "Dogs can learn more than 1000 words. 🐶";
}
