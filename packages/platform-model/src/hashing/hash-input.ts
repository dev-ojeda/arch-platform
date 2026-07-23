// packages/platform-model/src/hashing/hash-input.ts

export interface HashInput {
  nodeName: string;
  sourceHash: string;
  configHash: string;
  depsHash: string;
  schemaVersion: number;
}
