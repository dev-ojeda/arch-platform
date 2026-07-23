// packages/build-core/src/state/state-paths.ts

import type { PathService } from '@arch/contracts';

export function getBuildStatePath(workspaceRoot: string, pathService: PathService): string {
  return pathService.join(workspaceRoot, '.arch', 'state.json');
}
