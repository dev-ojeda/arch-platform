// packages/tooling/src/runtime/events/tooling-event.ts

import { createTaskEvents } from './create-task-events.js';
import type { ToolingTaskEvents } from './tooling-task-events.js';

export const ToolingEvents = {
  build: createTaskEvents('tooling.build'),

  buildBundle: createTaskEvents('tooling.build.bundle'),

  buildTypes: createTaskEvents('tooling.build.types'),

  clean: createTaskEvents('tooling.clean'),

  dev: createTaskEvents('tooling.dev'),

  lint: createTaskEvents('tooling.lint'),

  typecheck: createTaskEvents('tooling.typecheck'),

  test: createTaskEvents('tooling.test'),
} as const satisfies Record<string, ToolingTaskEvents>;
