// packages/application/src/generation/pipeline/generation-pipeline.ts

import type {
  GenerationContext,
  GenerationHooks,
  GenerationPipelineStep,
} from "@arch/contracts";

import { randomUUID } from "node:crypto";

import { measureStepExecution } from "../telemetry/measure-step-execution.js";

import type { RuntimeEventBus } from "../../runtime/events/runtime-event-bus.js";

import { RuntimeEventTypes } from "../../runtime/events/runtime-event-types.js";

export class GenerationPipeline {
  constructor(
    private readonly steps: readonly GenerationPipelineStep[],

    private readonly hooks?: GenerationHooks,

    private readonly runtimeEvents?: RuntimeEventBus
  ) {}

  async execute(context: GenerationContext): Promise<void> {
    const executionId = randomUUID();

    const pipelineId = "generation-pipeline";

    try {
      await this.runtimeEvents?.emit({
        executionId,

        pipelineId,

        type: RuntimeEventTypes.PipelineStarted,

        timestamp: Date.now(),
      });

      await this.hooks?.beforePipeline?.(context);

      for (const step of this.steps) {
        const startedAt = Date.now();

        await this.runtimeEvents?.emit({
          executionId,

          pipelineId,

          stepId: step.name,

          stepName: step.name,

          type: RuntimeEventTypes.StepStarted,

          timestamp: startedAt,
        });

        try {
          await measureStepExecution(
            context,

            step,

            async () => {
              await this.hooks?.beforeStep?.(step, context);

              await step.execute(context);

              await this.hooks?.afterStep?.(step, context);
            }
          );

          await this.runtimeEvents?.emit({
            executionId,

            pipelineId,

            stepId: step.name,

            stepName: step.name,

            type: RuntimeEventTypes.StepCompleted,

            timestamp: Date.now(),

            durationMs: Date.now() - startedAt,
          });
        } catch (error) {
          await this.runtimeEvents?.emit({
            executionId,

            pipelineId,

            stepId: step.name,

            stepName: step.name,

            type: RuntimeEventTypes.StepFailed,

            timestamp: Date.now(),

            durationMs: Date.now() - startedAt,

            error,
          });

          throw error;
        }
      }

      await this.runtimeEvents?.emit({
        executionId,

        pipelineId,

        type: RuntimeEventTypes.PipelineCompleted,

        timestamp: Date.now(),
      });

      await this.hooks?.onSuccess?.(context);
    } catch (error) {
      await this.runtimeEvents?.emit({
        executionId,

        pipelineId,

        type: RuntimeEventTypes.PipelineFailed,

        timestamp: Date.now(),

        error,
      });

      await this.hooks?.onError?.(error, context);

      throw error;
    } finally {
      await this.hooks?.afterPipeline?.(context);
    }
  }
}
