// packages/build-core/src/application/build-application-context.ts

import type { CommandRunner } from '../public/command-runner.js';

export interface BuildApplicationContext {
  workspaceRoot: string;
  runner: CommandRunner;
}
