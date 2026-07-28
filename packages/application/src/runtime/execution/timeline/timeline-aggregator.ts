// packages/application/src/runtime/execution/timeline/timeline-aggregator.ts

import type {
  PipelineCompletedEvent,
  PipelineFailedEvent,
  PipelineStartedEvent,
} from '../events/pipeline-events.js';
import type { RuntimeEventListener } from '../events/runtime-event-listener.js';
import { RuntimeEventTypes } from '../events/runtime-event-types.js';
import type { RuntimeEvent } from '../events/runtime-event.js';
import type {
  StepCompletedEvent,
  StepFailedEvent,
  StepStartedEvent,
} from '../events/step-events.js';
import { ExecutionStatus } from '../status/execution-status.js';

import type { ExecutionTimeline } from './execution-timeline.js';

interface MutableExecutionTimelineStep {
  stepId: string;

  stepName: string;

  status: ExecutionStatus;

  startedAt?: number;

  finishedAt?: number;

  durationMs?: number;

  error?: unknown;
}

interface MutableExecutionTimeline {
  executionId: string;

  pipelineId: string;

  status: ExecutionStatus;

  startedAt?: number;

  finishedAt?: number;

  durationMs?: number;

  error?: unknown;

  steps: MutableExecutionTimelineStep[];
}

export class TimelineAggregator implements RuntimeEventListener {
  private readonly timelines = new Map<string, MutableExecutionTimeline>();

  onEvent(event: RuntimeEvent): Promise<void> {
    const timeline = this.getOrCreateTimeline(event);

    switch (event.type) {
      case RuntimeEventTypes.PipelineStarted:
        this.markPipelineRunning(timeline, event);
        break;

      case RuntimeEventTypes.PipelineCompleted:
        this.markPipelineCompleted(timeline, event);
        break;

      case RuntimeEventTypes.PipelineFailed:
        this.markPipelineFailed(timeline, event);
        break;

      case RuntimeEventTypes.StepStarted:
        this.markStepStarted(timeline, event);
        break;

      case RuntimeEventTypes.StepCompleted:
        this.markStepCompleted(timeline, event);
        break;

      case RuntimeEventTypes.StepFailed:
        this.markStepFailed(timeline, event);
        break;
    }

    return Promise.resolve();
  }

  getTimeline(executionId: string): ExecutionTimeline | undefined {
    const timeline = this.timelines.get(executionId);

    return timeline ? structuredClone(timeline) : undefined;
  }

  getAllTimelines(): readonly ExecutionTimeline[] {
    return structuredClone([...this.timelines.values()]);
  }

  private getOrCreateTimeline(event: RuntimeEvent): MutableExecutionTimeline {
    let timeline = this.timelines.get(event.executionId);

    if (timeline) {
      return timeline;
    }

    timeline = {
      executionId: event.executionId,

      pipelineId: event.pipelineId,

      status: ExecutionStatus.Pending,

      steps: [],
    };

    this.timelines.set(event.executionId, timeline);

    return timeline;
  }

  private markPipelineRunning(
    timeline: MutableExecutionTimeline,
    event: PipelineStartedEvent,
  ): void {
    timeline.status = ExecutionStatus.Running;

    timeline.startedAt = event.timestamp;
  }

  private markPipelineCompleted(
    timeline: MutableExecutionTimeline,
    event: PipelineCompletedEvent,
  ): void {
    timeline.status = ExecutionStatus.Success;

    timeline.finishedAt = event.timestamp;

    timeline.durationMs = this.calculateDuration(timeline.startedAt, timeline.finishedAt);
  }

  private markPipelineFailed(timeline: MutableExecutionTimeline, event: PipelineFailedEvent): void {
    timeline.status = ExecutionStatus.Failed;

    timeline.finishedAt = event.timestamp;

    timeline.durationMs = this.calculateDuration(timeline.startedAt, timeline.finishedAt);

    timeline.error = event.error;
  }

  private markStepStarted(timeline: MutableExecutionTimeline, event: StepStartedEvent): void {
    const existingStep = this.findStep(timeline, event.stepId);

    if (existingStep) {
      return;
    }

    timeline.steps.push({
      stepId: event.stepId,

      stepName: event.stepName,

      status: ExecutionStatus.Running,

      startedAt: event.timestamp,
    });
  }

  private markStepCompleted(timeline: MutableExecutionTimeline, event: StepCompletedEvent): void {
    const step = this.findStep(timeline, event.stepId);

    if (!step) {
      return;
    }

    step.status = ExecutionStatus.Success;

    step.finishedAt = event.timestamp;

    step.durationMs = event.durationMs;
  }

  private markStepFailed(timeline: MutableExecutionTimeline, event: StepFailedEvent): void {
    const step = this.findStep(timeline, event.stepId);

    if (!step) {
      return;
    }

    step.status = ExecutionStatus.Failed;

    step.finishedAt = event.timestamp;

    step.durationMs = event.durationMs;

    step.error = event.error;
  }

  private findStep(
    timeline: MutableExecutionTimeline,
    stepId: string,
  ): MutableExecutionTimelineStep | undefined {
    return timeline.steps.find((candidate) => candidate.stepId === stepId);
  }

  private calculateDuration(startedAt?: number, finishedAt?: number): number | undefined {
    if (startedAt === undefined || finishedAt === undefined) {
      return undefined;
    }

    return finishedAt - startedAt;
  }
}
