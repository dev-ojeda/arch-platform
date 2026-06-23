// packages/build-core/src/application/build-application-context.ts

import type { CommandRunner } from '../runtime/command-runner.js';

export interface BuildApplicationContext {
  workspaceRoot: string;
  runner: CommandRunner;
}
