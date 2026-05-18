// packages/contracts/src/telemetry/step-execution-metric.ts

export interface StepExecutionMetric {
  readonly step: string;

  readonly duration: number;

  readonly startedAt: number;

  readonly finishedAt: number;
}
