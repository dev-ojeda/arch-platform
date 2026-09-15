// packages/infrastructure/src/serialization/safe-parse.ts

export function safeParse<T>(content: string): T {
  return JSON.parse(content) as T;
}
