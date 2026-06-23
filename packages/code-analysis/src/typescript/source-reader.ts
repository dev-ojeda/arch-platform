import type { Project } from 'ts-morph';

export function getSourceFiles(
  project: Project
) {
  return project.getSourceFiles();
}
