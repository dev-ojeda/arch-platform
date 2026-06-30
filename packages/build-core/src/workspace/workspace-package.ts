// packages/build-core/src/workspace/workspace-package.ts

import type { PackageBuildConfig } from './package-json.js';

export type WorkspacePackage = {
  name: string;
  root: string;

  dependencies: string[];

  buildDependencies: string[];

  outputs: string[];

  build?: PackageBuildConfig;
};
