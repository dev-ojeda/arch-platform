// packages\tooling\src\commands\build.ts

import { ToolingEvents } from '../runtime/events/tooling-event.js';
import { runCommand } from '../runtime/run-command.js';

import { buildWorkspace } from './build/build-workspace.js';

export async function buildCommand(): Promise<void> {
  process.exitCode = await runCommand({
    events: ToolingEvents.build,
    action: buildWorkspace,
  });
}
