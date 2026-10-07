// packages/application/src/use-cases/inspect-artifact/inspect-result.ts

import type { PackedArtifactInspect } from '@arch-platform/platform-model';

export interface InspectResult {
  readonly success: boolean;
  readonly durationMs: number;
  readonly artifact: string;
  readonly inspection: PackedArtifactInspect;
}
