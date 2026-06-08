// packages\application\test\unit\runtime\enforce-timeout-policy.test.ts

import type { GenerationContext } from '@arch/contracts/generation';
import { createTestPipelineContext } from '@arch/testing/pipeline';
import { describe, expect, it, vi } from 'vitest';

import { enforceTimeoutPolicy } from '../../../src/generation/runtime/enforce-timeout-policy.js';

describe('CreateTestEnforceTmeoutPolicy', () => {
  it('does nothing when timeout policy is not configured', () => {
    const context = createTestPipelineContext();

    enforceTimeoutPolicy(context);

    expect(context.cancelled).toBeUndefined();
    expect(context.cancellationReason).toBeUndefined();
  });
  it('cancels context when timeout expires', () => {
    vi.useFakeTimers();

    const context = createTestPipelineContext();

    context.timeoutPolicy = {
      timeout: 1000,
    };

    enforceTimeoutPolicy(context);

    expect(context.cancelled).toBeUndefined();

    vi.advanceTimersByTime(1000);

    expect(context.cancelled).toBe(true);
    expect(context.cancellationReason).toBe('TIMEOUT');

    vi.useRealTimers();
  });
  it('calls throwIfAborted when available', () => {
    vi.useFakeTimers();

    const throwIfAborted = vi.fn();

    const context = {
      timeoutPolicy: {
        timeout: 1000,
      },
      signal: {
        throwIfAborted,
      } as unknown as AbortSignal,
    } as GenerationContext;

    enforceTimeoutPolicy(context);

    vi.advanceTimersByTime(1000);

    expect(throwIfAborted).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
