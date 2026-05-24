// packages/application/src/generation/pipeline/generation-pipeline.ts

import type {
  GenerationContext,
  GenerationHooks,
  GenerationPipelineStep,
  IdGenerator,
} from '@arch/contracts';

import type { RuntimeEventBus } from '../../runtime/events/runtime-event-bus.js';
import { RuntimeEventTypes } from '../../runtime/events/runtime-event-types.js';
import { measureStepExecution } from '../telemetry/measure-step-execution.js';

export class GenerationPipeline {
  constructor(
    private readonly steps: readonly GenerationPipelineStep[],

    private readonly idGenerator: IdGenerator,

    private readonly hooks?: GenerationHooks,

    private readonly runtimeEvents?: RuntimeEventBus,
  ) {}

  async execute(context: GenerationContext): Promise<void> {
    const executionId = this.idGenerator.generate();

    const pipelineId = 'generation-pipeline';

    try {
      await this.emitPipelineStarted(executionId, pipelineId);

      await this.hooks?.beforePipeline?.(context);

      for (const step of this.steps) {
        await this.executeStep(executionId, pipelineId, step, context);
      }

      await this.emitPipelineCompleted(executionId, pipelineId);

      await this.hooks?.onSuccess?.(context);
    } catch (error) {
      await this.emitPipelineFailed(executionId, pipelineId, error);

      await this.hooks?.onError?.(error, context);

      throw error;
    } finally {
      await this.hooks?.afterPipeline?.(context);
    }
  }

  private async executeStep(
    executionId: string,
    pipelineId: string,
    step: GenerationPipelineStep,
    context: GenerationContext,
  ): Promise<void> {
    const startedAt = Date.now();

    await this.emitStepStarted(executionId, pipelineId, step, startedAt);

    try {
      await measureStepExecution(context, step, async () => {
        await this.hooks?.beforeStep?.(step, context);

        await step.execute(context);

        await this.hooks?.afterStep?.(step, context);
      });

      await this.emitStepCompleted(executionId, pipelineId, step, startedAt);
    } catch (error) {
      await this.emitStepFailed(executionId, pipelineId, step, startedAt, error);

      throw error;
    }
  }

  private async emitPipelineStarted(executionId: string, pipelineId: string): Promise<void> {
    await this.runtimeEvents?.emit({
      executionId,

      pipelineId,

      type: RuntimeEventTypes.PipelineStarted,

      timestamp: Date.now(),
    });
  }

  private async emitPipelineCompleted(executionId: string, pipelineId: string): Promise<void> {
    await this.runtimeEvents?.emit({
      executionId,

      pipelineId,

      type: RuntimeEventTypes.PipelineCompleted,

      timestamp: Date.now(),
    });
  }

  private async emitPipelineFailed(
    executionId: string,
    pipelineId: string,
    error: unknown,
  ): Promise<void> {
    await this.runtimeEvents?.emit({
      executionId,

      pipelineId,

      type: RuntimeEventTypes.PipelineFailed,

      timestamp: Date.now(),

      error,
    });
  }

  private async emitStepStarted(
    executionId: string,
    pipelineId: string,
    step: GenerationPipelineStep,
    startedAt: number,
  ): Promise<void> {
    await this.runtimeEvents?.emit({
      executionId,

      pipelineId,

      stepId: step.name,

      stepName: step.name,

      type: RuntimeEventTypes.StepStarted,

      timestamp: startedAt,
    });
  }

  private async emitStepCompleted(
    executionId: string,
    pipelineId: string,
    step: GenerationPipelineStep,
    startedAt: number,
  ): Promise<void> {
    await this.runtimeEvents?.emit({
      executionId,

      pipelineId,

      stepId: step.name,

      stepName: step.name,

      type: RuntimeEventTypes.StepCompleted,

      timestamp: Date.now(),

      durationMs: Date.now() - startedAt,
    });
  }

  private async emitStepFailed(
    executionId: string,
    pipelineId: string,
    step: GenerationPipelineStep,
    startedAt: number,
    error: unknown,
  ): Promise<void> {
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
  }
}
