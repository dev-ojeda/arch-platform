// packages/build-core/test/helpers/build-task-runner.ts

import { vi } from 'vitest';

import type { BuildTaskRunner } from '../../src/graph/build-task-runner.js';

export function createBuildTaskRunner(implementation: BuildTaskRunner['run']): BuildTaskRunner {
  return {
    run: vi.fn(implementation),
  } as unknown as BuildTaskRunner;
}
