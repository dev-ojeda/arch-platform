// packages/application/src/runtime/timeline/timeline-aggregator.ts
import type { RuntimeEvent } from "../events/runtime-event.js";

import type { RuntimeEventListener } from "../events/runtime-event-listener.js";

import { RuntimeEventTypes } from "../events/runtime-event-types.js";

import type { ExecutionTimeline } from "./execution-timeline.js";

import { TimelineStatuses } from "./timeline-status.js";

export class TimelineAggregator implements RuntimeEventListener {
  private readonly timelines = new Map<string, ExecutionTimeline>();

  async onEvent(event: RuntimeEvent): Promise<void> {
    let timeline = this.timelines.get(event.executionId);

    if (!timeline) {
      timeline = {
        executionId: event.executionId,

        pipelineId: event.pipelineId,

        steps: [],
      };

      this.timelines.set(event.executionId, timeline);
    }

    switch (event.type) {
      case RuntimeEventTypes.PipelineStarted: {
        timeline.startedAt = event.timestamp;

        break;
      }

      case RuntimeEventTypes.PipelineCompleted: {
        timeline.finishedAt = event.timestamp;

        if (timeline.startedAt) {
          timeline.durationMs = timeline.finishedAt - timeline.startedAt;
        }

        break;
      }

      case RuntimeEventTypes.StepStarted: {
        timeline.steps.push({
          stepId: event.stepId ?? "unknown",

          stepName: event.stepName ?? "unknown",

          status: TimelineStatuses.Running,

          startedAt: event.timestamp,
        });

        break;
      }

      case RuntimeEventTypes.StepCompleted: {
        const step = timeline.steps.find(
          (candidate) => candidate.stepId === event.stepId
        );

        if (!step) return;

        step.status = TimelineStatuses.Success;

        step.finishedAt = event.timestamp;

        step.durationMs = event.durationMs;

        break;
      }

      case RuntimeEventTypes.StepFailed: {
        const step = timeline.steps.find(
          (candidate) => candidate.stepId === event.stepId
        );

        if (!step) return;

        step.status = TimelineStatuses.Failed;

        step.finishedAt = event.timestamp;

        step.durationMs = event.durationMs;

        step.error = event.error;

        break;
      }
    }
  }

  getTimeline(executionId: string): ExecutionTimeline | undefined {
    return this.timelines.get(executionId);
  }

  getAllTimelines(): readonly ExecutionTimeline[] {
    return [...this.timelines.values()];
  }
}
