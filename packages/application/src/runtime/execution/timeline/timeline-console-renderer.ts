// packages/application/src/runtime/timeline/timeline-console-renderer.ts

import type { ExecutionTimeline } from './execution-timeline.js';

const SUCCESS_ICON = '✓';
const FAILED_ICON = '✗';
const PENDING_ICON = '•';

export class TimelineConsoleRenderer {
  render(timeline: ExecutionTimeline): void {
    console.log('');
    console.log('Execution Timeline');
    console.log('');

    for (const step of timeline.steps) {
      console.log(
        `[${this.getStepIcon(step.status)}] ` +
          `${step.stepName} :: ` +
          `${step.durationMs ?? 0}ms`,
      );
    }

    console.log('');

    console.log(`Total Duration :: ${timeline.durationMs ?? 0}ms`);
  }

  private getStepIcon(status: string): string {
    switch (status) {
      case 'success':
        return SUCCESS_ICON;

      case 'failed':
        return FAILED_ICON;

      default:
        return PENDING_ICON;
    }
  }
}
