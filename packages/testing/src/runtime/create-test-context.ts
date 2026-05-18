// packages/testing/src/runtime/create-test-context.ts

import type {
  FileSystemPort,
  GenerationContext,
  GenerationDiagnostic,
  LoggerPort,
  NamedVariables,
  StepExecutionMetric,
  TechnologyStack,
} from "@arch/contracts";
import { createMemoryFilesystem } from "../filesystem/create-memory-filesystem.js";
import { TestLogger } from "../logging/test-logger.js";
import { createTestTechnologyStack } from "./create-test-technology-stack.js";

export interface CreateTestContextOptions<
  TVariables extends NamedVariables = NamedVariables
> {
  variables?: TVariables;

  targetDir?: string;

  logger?: LoggerPort;

  fs?: FileSystemPort;

  stack?: TechnologyStack;

  signal?: AbortSignal;

  diagnostics?: GenerationDiagnostic;

  metrics?: StepExecutionMetric;
}

export function createTestContext<TVariables extends NamedVariables>(
  options: CreateTestContextOptions<TVariables> = {}
): GenerationContext<TVariables> {
  return {
    fs: options.fs ?? createMemoryFilesystem(),

    logger: options.logger ?? new TestLogger(),

    targetDir: options.targetDir ?? "/workspace",

    variables: (options.variables ?? {}) as TVariables,

    stack: options.stack ?? createTestTechnologyStack(),

    signal: options.signal,

    files: [],

    metadata: new Map<string, unknown>(),

    diagnostics: [],

    metrics: [],
  };
}
