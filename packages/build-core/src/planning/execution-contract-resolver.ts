// packages/build-core/src/planning/execution-contract-resolver.ts

import type { ExecutionContract } from '../runtime/execution/execution-contract.js';

export interface ExecutionContractResolver {
  resolve(packageName: string): ExecutionContract;
}
