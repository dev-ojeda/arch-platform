// packages/platform-model/src/graph/cycle-detection-result.ts

export interface CycleDetectionResult {
  readonly hasCycle: boolean;
  readonly cycles: readonly string[][];
  readonly cycleCount: number;
}
