// packages/compliance/src/dependency/dependency-lock-file.ts

import type { DependencyLockfileCatalog } from './dependency-lock-file-catalog.js';
import type { DependencyLockfileImporter } from './dependency-lock-file-importer.js';
import type { DependencyLockfilePackage } from './dependency-lock-file-package.js';

export interface DependencyLockfile {
  readonly lockfileVersion: string;
  readonly catalogs: Readonly<Record<string, DependencyLockfileCatalog>>;
  readonly importers: Readonly<Record<string, DependencyLockfileImporter>>;
  readonly packages: Readonly<Record<string, DependencyLockfilePackage>>;
}
