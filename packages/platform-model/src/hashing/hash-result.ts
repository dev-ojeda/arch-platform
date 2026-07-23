// packages/platform-model/src/hashing/hash-result.ts

export interface HashResult {
  hash: string;

  sourceHash: string;
  configHash: string;
  depsHash: string;

  schemaVersion: number;
}
