// packages/code-analysis/src/project/ts-project-factory.ts

import { Project } from 'ts-morph';

import type { TsProjectOptions } from './ts-project-options.js';

export function createTsProject(options: TsProjectOptions): Project {
  return new Project({
    tsConfigFilePath: options.tsConfigFilePath,
  });
}
