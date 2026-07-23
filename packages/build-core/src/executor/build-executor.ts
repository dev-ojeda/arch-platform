// packages/build-core/src/executor/build-executor.ts

// packages/build-core/src/executor/build-executor.ts
import type { DagNode } from '@arch/platform-model';

import type { BuildPlanEntry } from '../planning/plan-entry.js';

import type { BuildResult } from './build-result.js';

/**
 * Contract for executing package build operations.
 *
 * Implementations are responsible for executing the build steps
 * associated with a package and returning a normalized result.
 *
 * Execution decisions such as package selection and ordering are
 * handled by planning and scheduling components.
 */
export interface BuildExecutor {
  execute(node: DagNode, plan: BuildPlanEntry): Promise<BuildResult>;
}
