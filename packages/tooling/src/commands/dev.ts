// packages/tooling/src/commands/dev.ts

import { ToolingEvents } from '../runtime/events/tooling-event.js';
import { runCommand } from '../runtime/run-command.js';

import { devWorkspace } from './dev/dev-workspace.js';

export async function devCommand(): Promise<void> {
  process.exitCode = await runCommand({
    events: ToolingEvents.dev,
    action: devWorkspace,
  });
}
