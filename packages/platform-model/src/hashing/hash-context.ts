// packages/platform-model/src/hashing/hash-context.ts

export interface HashContext {
  dependencyHashes: readonly string[];
  dependencyNames?: readonly string[]; // opcional para debug futuro
}
