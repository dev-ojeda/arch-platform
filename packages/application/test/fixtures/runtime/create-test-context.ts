import type {
  FileSystemAsyncPort,
  GenerationContext,
  GenerationDiagnostic,
  GenerationEventBus,
  LoggerPort,
  StepExecutionMetric,
  TechnologyStack,
  TemplateVariables,
} from '@arch-platform/contracts';

import {
  MemoryAsyncFileSystemAdapter,
  MemoryFileSystem,
  PosixPathService,
} from '@arch-platform/infrastructure';

import { createTestEventBus } from '../events/create-test-event-bus.js';
import { TestLogger } from '../logging/test-logger.js';

export interface CreateTestContextOptions<
  TVariables extends TemplateVariables = TemplateVariables,
> {
  variables?: TVariables;
  targetDir?: string;
  languageId?: string;
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
  const pathService = new PosixPathService();
  const memoryFilesystem = new MemoryFileSystem(pathService);
  const fs =
    options.fs ?? new MemoryAsyncFileSystemAdapter(new MemoryFileSystem(new PosixPathService()));
  return {
    fs,

    logger: options.logger ?? new TestLogger(),

    eventBus: options.eventBus ?? createTestEventBus(),

    targetDir: options.targetDir ?? '/workspace',
    signal: options.signal,
    languageId: options.languageId ?? 'typescript',

    variables: (options.variables ?? {}) as TVariables,
    stack: options.stack,

    files: [],
    metadata: new Map<string, unknown>(),

    diagnostics: options.diagnostics ?? [],
    metrics: options.metrics ?? [],
  };
}
