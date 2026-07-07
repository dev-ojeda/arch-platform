import type { BuildResult } from '../../src/executor/build-result.js';

export function createSkippedResult(packageName: string): BuildResult {
  return {
    package: packageName,
    status: 'skipped',
    changeReason: 'dependency-failed',
    execution: {
      reason: 'failed',
    },
    cache: {
      decision: 'miss',
      action: 'none',
    },
  };
}
export function createSuccessResult(packageName: string): BuildResult {
  return {
    package: packageName,
    status: 'success',
    changeReason: 'source',
    execution: {
      reason: 'executed',
    },
    cache: {
      decision: 'miss',
      action: 'none',
    },
  };
}
