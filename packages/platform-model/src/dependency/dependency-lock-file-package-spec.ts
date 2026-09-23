// packages/platform-model/src/dependency/dependency-lock-file-package-spec.ts

export interface DependencyLockfilePackageSpec {
  readonly specifier?: string;
  readonly version?: string;
}
