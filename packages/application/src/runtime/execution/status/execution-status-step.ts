// packages/application/src/runtime/execution/status/execution-status-step.ts

export const StepEventTypes = {
  StepStarted: 'step_started',
  StepCompleted: 'step_completed',
  StepFailed: 'step_failed',
  StepRetry: 'step_retry',
  StepCancelled: 'step_cancelled',
} as const;

export type StepEventTypes = (typeof StepEventTypes)[keyof typeof StepEventTypes];
