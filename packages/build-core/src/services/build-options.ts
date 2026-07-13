// packages/build-core/src/services/build-options.ts

import type { BuildScope } from '../planning/build-scope.js';

export type DependencyMode = 'required' | 'none' | 'only';
export type ExecutionMode = 'normal' | 'force';
export type CacheMode = 'default' | 'disabled';

export interface BuildOptions {
  readonly scope: BuildScope;

  readonly dependencyMode?: DependencyMode;

  readonly executionMode?: ExecutionMode;

  readonly cacheMode?: CacheMode;

  readonly watch?: boolean;

  readonly concurrency?: number;
}
