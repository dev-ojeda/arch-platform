// packages/build-core/src/package/packages-root.ts

import type { PackageBuildConfig } from './package-config.js';

export type PackageRoot = {
  name: string;
  root: string;

  dependencies: string[];

  buildDependencies: string[];

  outputs: string[];

  build?: PackageBuildConfig;
};
