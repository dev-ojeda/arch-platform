// packages/platform-model/src/dependency/dependency-lock-file-snapshot.ts

export interface DependencyLockfileSnapshot {
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly optionalDependencies?: Readonly<Record<string, string>>;
}
