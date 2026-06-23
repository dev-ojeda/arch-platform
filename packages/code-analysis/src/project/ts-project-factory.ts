// code-analysis/src/project/ts-project-factory.ts

import { Project } from 'ts-morph';

export interface TsProjectOptions {
  tsConfigFilePath: string;
}
export function createTsProject(options: TsProjectOptions): Project {
  return new Project({
    tsConfigFilePath: options.tsConfigFilePath,
  });
}
