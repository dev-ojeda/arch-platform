// packages/build-core/src/services/build-option.ts

import type { BuildScope } from '../planning/build-scope.js';

export interface BuildOptions {
  readonly scope?: BuildScope;

  readonly packageName?: string;

  readonly dependencyMode?: 'required' | 'none' | 'only';

  readonly executionMode?: 'normal' | 'force';

  readonly cacheMode?: 'default' | 'disabled';

  readonly watch?: boolean;

  readonly concurrency?: number;
}
