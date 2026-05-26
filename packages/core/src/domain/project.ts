// packages/core/src/domain/project.ts
export type ProjectType = 'application' | 'library' | 'tool';

export interface Project {
  name: string;

  type: ProjectType;

  root: string;

  tags: string[];

  dependencies: string[];

  metadata?: Record<string, unknown>;
}
