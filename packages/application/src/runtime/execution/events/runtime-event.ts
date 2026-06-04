// packages/application/src/runtime/execution/events/runtime-event.ts

import type { PipelineEvent } from './pipeline-events.js';
import type { StepEvent } from './step-events.js';

export type RuntimeEvent = PipelineEvent | StepEvent;
