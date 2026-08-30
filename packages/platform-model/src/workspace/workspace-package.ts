// packages/platform-model/src/workspace/workspace-package.ts

import type { ArtifactType } from '../artifact/artifact-type.js';
import type { PackageBuildConfig } from '../package/package-config.js';

export type WorkspacePackage = {
  readonly name: string;
  readonly root: string;

  readonly dependencies: readonly string[];
  readonly buildDependencies: readonly string[];
  readonly outputs: readonly string[];
  readonly artifactType: ArtifactType;
  readonly build?: PackageBuildConfig;
};
