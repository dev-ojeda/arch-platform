import type { GenerationContext, TemplateVariables } from '@arch/contracts';

import { createTestEventBus } from '../events/create-test-event-bus.js';
import { createMockFilesystem } from '../filesystem/create-mock-filesystem.js';
import { createTestLogger } from '../logging/create-test-logger.js';

function createDefaultGenerationContext<
  TVariables extends TemplateVariables,
>(): GenerationContext<TVariables> {
  return {
    targetDir: '/tmp',

    logger: createTestLogger(),

    eventBus: createTestEventBus(),

    fs: createMockFilesystem(),

    variables: {} as TVariables,

    files: [],

    metadata: new Map(),

    diagnostics: [],

    metrics: [],
  };
}

export function createTestGenerationContext<
  TVariables extends TemplateVariables = TemplateVariables,
>(overrides: Partial<GenerationContext<TVariables>> = {}): GenerationContext<TVariables> {
  return {
    ...createDefaultGenerationContext<TVariables>(),

    ...overrides,
  };
}
