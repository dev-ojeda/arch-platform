// packages/contracts/src/runtime/generation-cancellation-reason.ts
export type GenerationCancellationReason =
  | "USER_ABORT"
  | "TIMEOUT"
  | "STEP_TIMEOUT"
  | "ENGINE_SHUTDOWN";
