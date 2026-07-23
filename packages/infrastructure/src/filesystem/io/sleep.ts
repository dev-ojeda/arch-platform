// packages/infrastructure/src/filesystem/io/sleep.ts

export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
