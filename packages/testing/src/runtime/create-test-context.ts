// packages/testing/src/runtime/create-test-context.ts

import type { GenerationDiagnostic } from '@arch/contracts/diagnostics';
import type { GenerationEventBus } from '@arch/contracts/events';
import type { FileSystemPort } from '@arch/contracts/filesystem';
import type { GenerationContext } from '@arch/contracts/generation';
import type { LoggerPort } from '@arch/contracts/logging';
import type { TechnologyStack } from '@arch/contracts/stacks';
import type { StepExecutionMetric } from '@arch/contracts/telemetry';
import type { TemplateVariables } from '@arch/contracts/variables';
import { InMemoryGenerationEventBus } from '@arch/core/events';

import { createMemoryFilesystem } from '../filesystem/create-memory-filesystem.js';
import { TestLogger } from '../logging/test-logger.js';

import { createTestTechnologyStack } from './create-test-technology-stack.js';

export interface CreateTestContextOptions<
  TVariables extends TemplateVariables = TemplateVariables,
> {
  variables?: TVariables;

  targetDir?: string;

  logger?: LoggerPort;

  fs?: FileSystemPort;

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
