// packages/application/src/runtime/runtime-bootstrap.ts

import type { IdGenerator } from '@arch/contracts/runtime';

import { InMemoryRuntimeEventBus } from './execution/events/in-memory-runtime-event-bus.js';
import { TimelineAggregator } from './execution/timeline/timeline-aggregator.js';
import { TimelineConsoleRenderer } from './execution/timeline/timeline-console-renderer.js';

export interface RuntimeBootstrap {
  idGenerator: IdGenerator;

  runtimeEvents: InMemoryRuntimeEventBus;

  timelineAggregator: TimelineAggregator;

  timelineRenderer: TimelineConsoleRenderer;
}

export interface RuntimeBootstrapOptions {
  idGenerator: IdGenerator;
}

export function createRuntime(options: RuntimeBootstrapOptions): RuntimeBootstrap {
  const runtimeEvents = new InMemoryRuntimeEventBus();

  const timelineAggregator = new TimelineAggregator();

  const timelineRenderer = new TimelineConsoleRenderer();

  runtimeEvents.subscribe(timelineAggregator);

  return {
    idGenerator: options.idGenerator,

    runtimeEvents,

    timelineAggregator,

    timelineRenderer,
  };
}
