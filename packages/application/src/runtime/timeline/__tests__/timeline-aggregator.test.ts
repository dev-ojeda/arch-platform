// packages/application/src/runtime/timeline/__tests__/timeline-aggregator.test.ts

import { describe, expect, it } from "vitest";

import { createTestContext } from "@arch/testing";

import { GenerationPipeline } from "../../../generation/pipeline/generation-pipeline.js";

import { createRuntime } from "../../runtime-bootstrap.js";

import type { GenerationPipelineStep } from "@arch/contracts";

describe("TimelineAggregator", () => {
  it("builds execution timeline from runtime events", async () => {
    const context = createTestContext();

    const runtime = createRuntime();

    const steps: GenerationPipelineStep[] = [
      {
        name: "step-1",

        async execute() {},
      },

      {
        name: "step-2",

        async execute() {},
      },
    ];

    const pipeline = new GenerationPipeline(
      steps,

      undefined,

      runtime.runtimeEvents
    );

    await pipeline.execute(context);

    const timelines = runtime.timelineAggregator.getAllTimelines();

    expect(timelines).toHaveLength(1);

    expect(timelines[0]).toEqual(
      expect.objectContaining({
        pipelineId: "generation-pipeline",

        steps: expect.arrayContaining([
          expect.objectContaining({
            stepName: "step-1",

            status: "success",
          }),

          expect.objectContaining({
            stepName: "step-2",

            status: "success",
          }),
        ]),
      })
    );
  });
});
