// packages/tooling/src/commands/typecheck.ts

import { ToolingEvents } from '../runtime/events/tooling-event.js';
import { runCommand } from '../runtime/run-command.js';

import { typecheckWorkspace } from './typecheck/typecheck-workspace.js';

export async function typecheckCommand(): Promise<void> {
  process.exitCode = await runCommand({
    events: ToolingEvents.typecheck,
    action: typecheckWorkspace,
  });
}
