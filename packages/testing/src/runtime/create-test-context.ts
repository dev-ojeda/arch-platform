// packages/testing/src/runtime/create-test-context.ts

import type {
  FileSystemAsyncPort,
  GenerationContext,
  GenerationDiagnostic,
  GenerationEventBus,
  LoggerPort,
  StepExecutionMetric,
  TechnologyStack,
  TemplateVariables,
} from '@arch/contracts';
import { InMemoryGenerationEventBus } from '@arch/core';

import { createMemoryFilesystem } from '../filesystem/create-memory-filesystem.js';
import { TestLogger } from '../logging/test-logger.js';

import { createTestTechnologyStack } from './create-test-technology-stack.js';

export interface CreateTestContextOptions<
  TVariables extends TemplateVariables = TemplateVariables,
> {
  variables?: TVariables;

  targetDir?: string;

  logger?: LoggerPort;

  fs?: FileSystemAsyncPort;

  stack?: TechnologyStack;

  signal?: AbortSignal;

  diagnostics?: GenerationDiagnostic[];

  metrics?: StepExecutionMetric[];

  eventBus?: GenerationEventBus;
}

export function createTestContext<TVariables extends TemplateVariables>(
  options: CreateTestContextOptions<TVariables> = {},
): GenerationContext<TVariables> {
  return {
    /*
     * Infrastructure
     */

    fs: options.fs ?? createMemoryFilesystem(),

    /*
     * Runtime Services
     */

    logger: options.logger ?? new TestLogger(),

    eventBus: options.eventBus ?? new InMemoryGenerationEventBus(),

    /*
     * Request
     */

    targetDir: options.targetDir ?? '/workspace',

    signal: options.signal,

    /*
     * Generator State
     */

    variables: (options.variables ?? {}) as TVariables,

    stack: options.stack ?? createTestTechnologyStack(),

    /*
     * Runtime Artifacts
     */

    files: [],

    /*
     * Runtime Metadata
     */

    metadata: new Map<string, unknown>(),

    /*
     * Runtime Observability
     */

    diagnostics: options.diagnostics ?? [],

    metrics: options.metrics ?? [],
  };
}
