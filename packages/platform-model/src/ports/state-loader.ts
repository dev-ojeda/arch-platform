// packages/platform-model/src/ports/state-loader.ts

import type { BuildState } from '../state/build-state.js';

export interface StateLoader {
  load(workspaceRoot: string): BuildState;
}
