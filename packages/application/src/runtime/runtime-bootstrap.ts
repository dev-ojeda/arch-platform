// packages/application/src/runtime/runtime-bootstrap.ts

import { InMemoryRuntimeEventBus } from "./events/in-memory-runtime-event-bus.js";

import { TimelineAggregator } from "./timeline/timeline-aggregator.js";

import { TimelineConsoleRenderer } from "./timeline/timeline-console-renderer.js";

export interface RuntimeBootstrap {
  runtimeEvents: InMemoryRuntimeEventBus;

  timelineAggregator: TimelineAggregator;

  timelineRenderer: TimelineConsoleRenderer;
}

export function createRuntime(): RuntimeBootstrap {
  const runtimeEvents = new InMemoryRuntimeEventBus();

  const timelineAggregator = new TimelineAggregator();

  const timelineRenderer = new TimelineConsoleRenderer();

  runtimeEvents.subscribe(timelineAggregator);

  return {
    runtimeEvents,

    timelineAggregator,

    timelineRenderer,
  };
}
