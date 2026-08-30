// packages/platform-model/src/graph/dag-types.ts

import type { ArtifactType } from '../artifact/artifact-type.js';
import type { PackageBuildConfig } from '../package/package-config.js';

export interface DagNode {
  readonly name: string;
  readonly root: string;
  readonly dependencies: readonly string[];
  readonly dependents: readonly string[];
  readonly outputs: readonly string[];
  readonly artifactType: ArtifactType;
  readonly build?: PackageBuildConfig;
}

export interface MutableDagNode extends Omit<DagNode, 'dependencies' | 'dependents' | 'outputs'> {
  dependencies: string[];
  dependents: string[];
  outputs: string[];
}
