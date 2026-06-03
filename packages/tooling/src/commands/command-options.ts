// packages/tooling/src/commands/command-options.ts

import type { ToolingTaskEvents } from '../runtime/events/tooling-event.js';

export interface CommandOptions {
  readonly args?: readonly string[];
  readonly events?: ToolingTaskEvents;
}
