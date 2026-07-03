// packages/build-core/src/package/package-json.ts

import type { PackageBuildConfig } from './package-config.js';

export type PackageJson = {
  name: string;

  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;

  arch?: {
    build?: PackageBuildConfig;
  };

  main?: string;
  types?: string;
  outputs?: string[];
};
