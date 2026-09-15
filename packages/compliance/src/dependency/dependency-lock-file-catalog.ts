// packages/compliance/src/dependency/dependency-lock-file-catalog.ts

import type { DependencyLockfilePackageSpec } from './dependency-lock-file-package-spec.js';

export type DependencyLockfileCatalog = Readonly<Record<string, DependencyLockfilePackageSpec>>;
