// packages/governance/src/types/cycle-detection-result.ts

export interface CycleDetectionResult {
  hasCycle: boolean;
  cycles: string[][];
}
