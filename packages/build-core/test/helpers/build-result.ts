import type { BuildResult } from '../../src/executor/build-result.js';

export function createSkippedResult(packageName: string): BuildResult {
  return {
    package: packageName,
    status: 'skipped',
    changeReason: 'dependency-failed',
    execution: {
      reason: 'failed',
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
  };
}
export function createFailedResult(packageName: string): BuildResult {
  return {
    package: packageName,
    status: 'failed',
    changeReason: 'source',
    execution: {
      reason: 'failed',
    },
  };
}
export function createCachedResult(packageName: string): BuildResult {
  return {
    package: packageName,
    status: 'skipped',
    changeReason: 'none',
    execution: {
      reason: 'cached',
    },
  };
}

export function createRestoredResult(packageName: string): BuildResult {
  return {
    package: packageName,
    status: 'skipped',
    changeReason: 'none',
    execution: {
      reason: 'restored',
    },
  };
}
