// packages/contracts/src/profiles/generation-profile.ts

export interface GenerationProfile {
  readonly generatorId: string;

  readonly averageDuration: number;

  readonly executions: number;

  readonly lastExecutedAt?: number;

  readonly slowestStep?: string;
}
