// packages/application/src/runtime/timeline/__tests__/timeline-aggregator-failure.test.ts

import { describe, expect, it } from "vitest";

import type { GenerationPipelineStep } from "@arch/contracts";

import { createTestContext } from "@arch/testing";

import { GenerationPipeline } from "../../../generation/pipeline/generation-pipeline.js";

import { createRuntime } from "../../runtime-bootstrap.js";

describe("TimelineAggregator Failure", () => {
  it("marks failed steps in execution timeline", async () => {
    const context = createTestContext();

    const runtime = createRuntime();

    const steps: GenerationPipelineStep[] = [
      {
        name: "successful-step",

        async execute() {},
      },

      {
        name: "failing-step",

        async execute() {
          throw new Error("step failure");
        },
      },
    ];

    const pipeline = new GenerationPipeline(
      steps,

      undefined,

      runtime.runtimeEvents
    );

    await expect(pipeline.execute(context)).rejects.toThrow("step failure");

    const timelines = runtime.timelineAggregator.getAllTimelines();

    expect(timelines).toHaveLength(1);

    const timeline = timelines[0];

    expect(timeline.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          stepName: "successful-step",

          status: "success",
        }),

        expect.objectContaining({
          stepName: "failing-step",

          status: "failed",
        }),
      ])
    );

    expect(timeline.finishedAt).toBeUndefined();
  });
});
