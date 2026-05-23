// packages/application/src/runtime/timeline/timeline-console-renderer.ts
import type { ExecutionTimeline } from './execution-timeline.js';

export class TimelineConsoleRenderer {
  render(timeline: ExecutionTimeline): void {
    console.log('');
    console.log('Execution Timeline');
    console.log('');

    for (const step of timeline.steps) {
      const icon = step.status === 'success' ? '✓' : step.status === 'failed' ? '✗' : '•';

      console.log(`[${icon}] ${step.stepName} :: ${step.durationMs ?? 0}ms`);
    }

    console.log('');

    console.log(`Total Duration :: ${timeline.durationMs ?? 0}ms`);
  }
}
