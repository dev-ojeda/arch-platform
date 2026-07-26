// packages/application/test/__tests__/recording-generation-report.test.ts

import { describe, expect, it, vi } from 'vitest';

import type { GenerationEvent } from '@arch/contracts';
import { RecordingGenerationEventBus } from '@arch/core';

import { createGenerationReport } from '../../src/generation/reports/create-generation-report.js';

describe('CreateTestRecordingGenerationReport', () => {
  function CreateEventName(): GenerationEvent {
    return {
      name: 'GENERATION_STARTED',
      timestamp: 0,
      payload: {},
    };
  }
  it('returns empty events when event bus is not a RecordingGenerationEventBus', () => {
    const context = {
      eventBus: {
        publish: vi.fn().mockResolvedValue(undefined),
        subscribe: vi.fn(),
      },
      files: [],
      diagnostics: [],
      metrics: [],
    } as never;

    const report = createGenerationReport(context, {
      success: true,
      duration: 100,
    });

    expect(report.events).toEqual([]);
  });

  it('includes recorded events when using RecordingGenerationEventBus', async () => {
    const eventBus = new RecordingGenerationEventBus();

    const generationEvent = CreateEventName();

    await eventBus.publish(generationEvent);

    const context = {
      eventBus,
      files: [],
      diagnostics: [],
      metrics: [],
    } as never;

    const report = createGenerationReport(context, {
      success: true,
      duration: 100,
    });

    expect(report.events).toEqual(eventBus.events);
    expect(report.events).toHaveLength(1);
  });
});
