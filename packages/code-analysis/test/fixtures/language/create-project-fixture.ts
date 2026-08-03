import { createTypeScriptProjectLoader } from '../../../src/language/create-typescript-project-loader.js';

export function createProjectFixture(tsconfig: string) {
  return createTypeScriptProjectLoader({
    tsConfigFilePath: tsconfig,
  });
}
