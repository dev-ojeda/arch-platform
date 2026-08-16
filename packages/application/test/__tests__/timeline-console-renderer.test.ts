// packages/application/src/runtime/timeline/__tests__/timeline-console-renderer.test.ts

import { afterEach, describe, expect, it, vi } from 'vitest';

import { EXECUTION_STATUS } from '../../src/runtime/execution/status/execution-status.js';
import { TimelineConsoleRenderer } from '../../src/runtime/execution/timeline/timeline-console-renderer.js';

describe('TimelineConsoleRenderer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders execution timeline', () => {
    const renderer = new TimelineConsoleRenderer();

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    renderer.render({
      executionId: 'exec-1',

      pipelineId: 'generation-pipeline',

      status: EXECUTION_STATUS.Success,

      startedAt: 0,

      finishedAt: 100,

      durationMs: 100,

      steps: [
        {
          stepId: 'step-1',

          stepName: 'load-config',

          status: EXECUTION_STATUS.Success,

          durationMs: 20,
        },

        {
          stepId: 'step-2',

          stepName: 'compile',

          status: EXECUTION_STATUS.Failed,

          durationMs: 80,
        },
      ],
    });

    expect(consoleSpy).toHaveBeenCalled();

    expect(consoleSpy).toHaveBeenCalledWith('');

    expect(consoleSpy).toHaveBeenCalledWith('Execution Timeline');

    expect(consoleSpy).toHaveBeenCalledWith('[✓] load-config :: 20ms');

    expect(consoleSpy).toHaveBeenCalledWith('[✗] compile :: 80ms');

    expect(consoleSpy).toHaveBeenCalledWith('Total Duration :: 100ms');
  });
});
