// packages/code-analysis/src/language/create-typescript-project-loader.ts

import { Project } from 'ts-morph';

import type { TypeScriptProjectOptions } from './typescript/typescript-project-options.js';

export function createTypeScriptProjectLoader(options: TypeScriptProjectOptions): Project {
  return new Project({
    tsConfigFilePath: options.tsConfigFilePath,
    useInMemoryFileSystem: options.tsConfigFilePath === undefined,
  });
}
