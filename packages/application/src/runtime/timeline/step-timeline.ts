// packages/application/src/runtime/timeline/step-timeline.ts
import type { TimelineStatus } from "./timeline-status.js";

export interface StepTimeline {
  stepId: string;

  stepName: string;

  status: TimelineStatus;

  startedAt?: number;

  finishedAt?: number;

  durationMs?: number;

  error?: unknown;
}
