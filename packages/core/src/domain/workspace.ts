// packages/core/src/domain/workspace.ts

import type { Project } from './project.js';

export interface Workspace {
  root: string;

  projects: Project[];

  metadata?: Record<string, unknown>;
}
