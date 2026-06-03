// packages/governance/src/helpers/helpers-json-parse.ts

export function parseJson<T>(content: string): T {
  return JSON.parse(content) as T;
}
