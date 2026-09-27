// packages/compliance/src/security/dependency-occurrence.ts

export interface DependencyOccurrence {
  readonly packageName: string;
  readonly version: string;
  readonly path: readonly string[];
}
