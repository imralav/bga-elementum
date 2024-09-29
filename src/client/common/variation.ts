export function randomVariation(from: number, variation: number): number {
  return from + Math.random() * (2 * variation) - variation;
}
