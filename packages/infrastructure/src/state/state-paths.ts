// packages/infrastructure/src/state/state-paths.ts

import type { PathService } from '@arch-platform/contracts';

export function getBuildStatePath(workspaceRoot: string, pathService: PathService): string {
  return pathService.join(workspaceRoot, '.arch-platform', 'state.json');
}

export function getArtifactStatePath(workspaceRoot: string, pathService: PathService): string {
  return pathService.join(workspaceRoot, '.arch-platform', 'artifact-state.json');
}
