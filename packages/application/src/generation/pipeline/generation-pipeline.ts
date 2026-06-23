// packages/application/src/generation/pipeline/generation-pipeline.ts

import type { GenerationContext, GenerationPipelineStep, TemplateVariables } from '@arch/contracts';

import type {
  PipelineCompletedEvent,
  PipelineFailedEvent,
  PipelineStartedEvent,
} from '../../runtime/execution/events/pipeline-events.js';
import { RuntimeEventTypes } from '../../runtime/execution/events/runtime-event-types.js';
import type { RuntimeEvent } from '../../runtime/execution/events/runtime-event.js';
import type {
  StepCompletedEvent,
  StepFailedEvent,
  StepStartedEvent,
} from '../../runtime/execution/events/step-events.js';
import { measureStepExecution } from '../telemetry/measure-step-execution.js';

import type { GenerationPipelineOptions } from './generation-pipeline-options.js';

export class GenerationPipeline<TVariables extends TemplateVariables = TemplateVariables> {
  constructor(private readonly options: GenerationPipelineOptions<TVariables>) {}

  private get hooks() {
    return this.options.hooks;
  }

  private get runtimeEvents() {
    return this.options.runtimeEvents;
  }

  async execute(context: GenerationContext<TVariables>): Promise<void> {
    const { idGenerator, steps, pipelineId = 'generation-pipeline' } = this.options;

    const executionId = idGenerator.generate();

    try {
      await this.emitEvent(this.createPipelineStartedEvent(executionId, pipelineId));

      await this.hooks?.beforePipeline?.(context);

      for (const step of steps) {
        await this.executeStep(executionId, pipelineId, step, context);
      }

      await this.emitEvent(this.createPipelineCompletedEvent(executionId, pipelineId));

      await this.hooks?.onSuccess?.(context);
    } catch (error) {
      await this.emitEvent(this.createPipelineFailedEvent(executionId, pipelineId, error));

      await this.hooks?.onError?.(error, context);

      throw error;
    } finally {
      await this.hooks?.afterPipeline?.(context);
    }
  }

  private async executeStep(
    executionId: string,
    pipelineId: string,
    step: GenerationPipelineStep<TVariables>,
    context: GenerationContext<TVariables>,
  ): Promise<void> {
    const startedAt = Date.now();

    await this.emitEvent(this.createStepStartedEvent(executionId, pipelineId, step, startedAt));

    try {
      await measureStepExecution(context, step, async () => {
        await this.hooks?.beforeStep?.(step, context);

        await step.execute(context);

        await this.hooks?.afterStep?.(step, context);
      });

      await this.emitEvent(
        this.createStepCompletedEvent(executionId, pipelineId, step, startedAt, Date.now()),
      );
    } catch (error) {
      await this.emitEvent(
        this.createStepFailedEvent(executionId, pipelineId, step, startedAt, Date.now(), error),
      );

      throw error;
    }
  }

  private emitEvent(event: RuntimeEvent): Promise<void> {
    return this.runtimeEvents?.emit(event) ?? Promise.resolve();
  }

  private createPipelineStartedEvent(
    executionId: string,
    pipelineId: string,
  ): PipelineStartedEvent {
    return {
      executionId,
      pipelineId,
      type: RuntimeEventTypes.PipelineStarted,
      timestamp: Date.now(),
    };
  }

  private createPipelineCompletedEvent(
    executionId: string,
    pipelineId: string,
  ): PipelineCompletedEvent {
    return {
      executionId,
      pipelineId,
      type: RuntimeEventTypes.PipelineCompleted,
      timestamp: Date.now(),
    };
  }

  private createPipelineFailedEvent(
    executionId: string,
    pipelineId: string,
    error: unknown,
  ): PipelineFailedEvent {
    return {
      executionId,
      pipelineId,
      type: RuntimeEventTypes.PipelineFailed,
      timestamp: Date.now(),
      error,
    };
  }

  private createStepStartedEvent(
    executionId: string,
    pipelineId: string,
    step: GenerationPipelineStep<TVariables>,
    startedAt: number,
  ): StepStartedEvent {
    return {
      executionId,
      pipelineId,
      stepId: step.name,
      stepName: step.name,
      type: RuntimeEventTypes.StepStarted,
      timestamp: startedAt,
    };
  }

  private createStepCompletedEvent(
    executionId: string,
    pipelineId: string,
    step: GenerationPipelineStep<TVariables>,
    startedAt: number,
    finishedAt: number,
  ): StepCompletedEvent {
    return {
      executionId,
      pipelineId,
      stepId: step.name,
      stepName: step.name,
      type: RuntimeEventTypes.StepCompleted,
      timestamp: finishedAt,
      durationMs: finishedAt - startedAt,
    };
  }

  private createStepFailedEvent(
    executionId: string,
    pipelineId: string,
    step: GenerationPipelineStep<TVariables>,
    startedAt: number,
    finishedAt: number,
    error: unknown,
  ): StepFailedEvent {
    return {
      executionId,
      pipelineId,
      stepId: step.name,
      stepName: step.name,
      type: RuntimeEventTypes.StepFailed,
      timestamp: finishedAt,
      durationMs: finishedAt - startedAt,
      error,
    };
  }
}
