// packages/compliance/src/dependency/dependency-lock-file-importer.ts

import type { DependencyLockfilePackageSpec } from './dependency-lock-file-package-spec.js';

export interface DependencyLockfileImporter {
  readonly dependencies?: Readonly<Record<string, DependencyLockfilePackageSpec>>;
  readonly devDependencies?: Readonly<Record<string, DependencyLockfilePackageSpec>>;
  readonly optionalDependencies?: Readonly<Record<string, DependencyLockfilePackageSpec>>;
}
