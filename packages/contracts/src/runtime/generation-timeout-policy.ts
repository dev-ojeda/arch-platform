// packages/contracts/src/runtime/generation-timeout-policy.ts
export interface GenerationTimeoutPolicy {
  readonly timeout: number;

  readonly abortOnTimeout?: boolean;
}
