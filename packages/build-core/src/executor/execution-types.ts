// packages/build-core/src/executor/execution-types.ts

export type ExecutionReason = 'cached' | 'restored' | 'executed' | 'failed';

export type SkipReason = 'dependency-failed' | 'not-in-scope';
