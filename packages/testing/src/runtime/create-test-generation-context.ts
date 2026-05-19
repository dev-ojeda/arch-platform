// packages/testing/src/runtime/create-test-generation-context.ts

import type { GenerationContext, NamedVariables } from "@arch/contracts";

const defaultGenerationContext: GenerationContext = {
  /*
   * Request
   */

  targetDir: "/tmp",

  /*
   * Runtime Services
   */

  logger: {
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
  } as never,

  eventBus: {
    publish: async () => {},
  } as never,

  /*
   * Infrastructure
   */

  fs: {} as never,

  /*
   * Variables
   */

  variables: {} satisfies NamedVariables,

  /*
   * Runtime Artifacts
   */

  files: [],

  /*
   * Runtime Metadata
   */

  metadata: new Map(),

  /*
   * Runtime Diagnostics
   */

  diagnostics: [],

  /*
   * Runtime Metrics
   */

  metrics: [],
};

export function createTestGenerationContext(
  overrides: Partial<GenerationContext> = {}
): GenerationContext {
  return {
    ...defaultGenerationContext,

    ...overrides,
  };
}
