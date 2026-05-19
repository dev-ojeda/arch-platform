// packages/application/src/runtime/events/runtime-event.ts
import type { RuntimeEventType } from "./runtime-event-types.js";

export interface RuntimeEvent {
  executionId: string;

  pipelineId: string;

  stepId?: string;

  stepName?: string;

  type: RuntimeEventType;

  timestamp: number;

  durationMs?: number;

  error?: unknown;

  metadata?: Record<string, unknown>;
}
