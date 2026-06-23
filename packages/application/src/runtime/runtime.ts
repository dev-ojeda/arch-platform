// packages/application/src/runtime/runtime.ts

import type { IdGenerator } from '@arch/contracts';

import type { RuntimeEventBus } from './execution/events/runtime-event-bus.js';

export interface Runtime {
  idGenerator: IdGenerator;

  runtimeEvents: RuntimeEventBus;
}
