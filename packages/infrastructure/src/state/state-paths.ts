// packages/infrastructure/src/state/state-paths.ts

import type { PathService } from '@arch/contracts';

export function getBuildStatePath(workspaceRoot: string, pathService: PathService): string {
  return pathService.join(workspaceRoot, '.arch', 'state.json');
}

export function getArtifactStatePath(workspaceRoot: string, pathService: PathService): string {
  return pathService.join(workspaceRoot, '.arch', 'artifact-state.json');
}
