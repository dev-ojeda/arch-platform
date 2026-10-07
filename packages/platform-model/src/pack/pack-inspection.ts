// packages/platform-model/src/pack/pack-inspection.ts

export interface PackInspection {
  readonly name: string;
  readonly version: string;
  readonly filesInside: readonly string[];
}
