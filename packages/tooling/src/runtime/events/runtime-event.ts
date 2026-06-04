// packages/tooling/src/runtime/events/runtime-event.ts

import { createRuntimeEvents } from './create-runtime-events.js';

export const RuntimeEvents = {
  command: createRuntimeEvents('runtime.command'),
} as const;
