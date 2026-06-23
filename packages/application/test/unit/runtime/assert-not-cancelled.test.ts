// packages\application\test\unit\runtime\assert-not-cancelled.test.ts

import { GenerationCancelledError } from '@arch/core';
import { describe, expect, it } from 'vitest';

import { assertNotCancelled } from '../../../src/generation/runtime/assert-not-cancelled.js';

describe('CreateTestAssertNotCancelled', () => {
  it('does nothing when signal is undefined', () => {
    expect(() => assertNotCancelled()).not.toThrow();
  });
  it('does nothing when signal is not aborted', () => {
    const controller = new AbortController();

    expect(() => {
      assertNotCancelled(controller.signal);
    }).not.toThrow();
  });
  it('throws when signal is aborted', () => {
    const controller = new AbortController();

    controller.abort();

    expect(() => {
      assertNotCancelled(controller.signal);
    }).toThrow(GenerationCancelledError);
  });
  it('throws using the provided cancellation reason', () => {
    const controller = new AbortController();

    controller.abort();

    expect(() => {
      assertNotCancelled(controller.signal, 'TIMEOUT');
    }).toThrow(GenerationCancelledError);
  });
});
