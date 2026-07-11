// packages/build-core/src/services/build-option.ts

export interface BuildOptions {
  readonly packageName: string;

  readonly dependencyMode?: 'required' | 'none' | 'only';

  readonly executionMode?: 'normal' | 'force';

  readonly cacheMode?: 'default' | 'disabled';

  readonly watch?: boolean;

  readonly concurrency?: number;
}
