import { ToolingEvents } from '../runtime/events/tooling-event.js';
import { runCommand } from '../runtime/run-command.js';

import { lintWorkspace } from './lint/lint-workspace.js';

export async function lintCommand(): Promise<void> {
  process.exitCode = await runCommand({
    events: ToolingEvents.lint,
    action: lintWorkspace,
  });
}
