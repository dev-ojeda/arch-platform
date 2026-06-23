// packages/build-core/src/hash/hash-result.ts

export interface HashResult {
  hash: string;

  sourceHash: string;
  configHash: string;
  depsHash: string;

  schemaVersion: number;
}
