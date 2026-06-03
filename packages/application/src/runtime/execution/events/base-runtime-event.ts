// packages/application/src/runtime/execution/events/base-runtime-event.ts

import type { RuntimeMetadata } from '@arch/contracts/runtime';

export interface BaseRuntimeEvent {
  readonly executionId: string;

  readonly pipelineId: string;

  readonly timestamp: number;

  readonly metadata?: RuntimeMetadata;
}
