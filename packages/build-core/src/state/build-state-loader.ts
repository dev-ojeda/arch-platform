// packages/build-core/src/state/build-state-loader.ts

import type { BuildState } from './state-types.js';

export interface BuildStateLoader {
  load(workspaceRoot: string): BuildState;
}
