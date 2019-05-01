export function randomBoolByPercentage(percentage: number): boolean {
  return Math.random() < percentage;
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}
