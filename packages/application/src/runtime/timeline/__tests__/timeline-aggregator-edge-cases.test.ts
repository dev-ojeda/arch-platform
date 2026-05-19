import { describe, expect, it } from "vitest";

import { TimelineAggregator } from "../timeline-aggregator.js";

import { RuntimeEventTypes } from "../../events/runtime-event-types.js";

describe("TimelineAggregator Edge Cases", () => {
  it("ignores completed events for unknown steps", async () => {
    const aggregator = new TimelineAggregator();

    await aggregator.onEvent({
      executionId: "exec-1",

      pipelineId: "pipeline-1",

      stepId: "unknown-step",

      stepName: "unknown-step",

      type: RuntimeEventTypes.StepCompleted,

      timestamp: Date.now(),

      durationMs: 10,
    });

    const timelines = aggregator.getAllTimelines();

    expect(timelines).toHaveLength(1);

    expect(timelines[0].steps).toHaveLength(0);
  });
});
