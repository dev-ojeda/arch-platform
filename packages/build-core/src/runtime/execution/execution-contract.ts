// packages/build-core/src/runtime/execution/execution-contract.ts

export type ExecutionCacheStrategy = 'content-hash' | 'input-hash' | 'custom';
export interface ExecutionInputs {
  files: string[];
  packages: readonly string[];
  env?: Record<string, string>;
}

export interface ExecutionOutputs {
  files: string[];
}

export interface ExecutionCachePolicy {
  strategy: ExecutionCacheStrategy;
  key?: string;
}

export interface ExecutionRunDefinition {
  executor: 'node' | 'custom';
  command?: string;
}
export interface ExecutionContract {
  id: string;

  inputs: ExecutionInputs;

  outputs: ExecutionOutputs;

  cache: ExecutionCachePolicy;

  run: ExecutionRunDefinition;
}
