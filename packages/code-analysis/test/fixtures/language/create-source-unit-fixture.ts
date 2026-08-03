// packages/code-analysis/test/fixtures/language/create-source-unit-fixture.ts

import { TypeScriptSourceUnit } from '../../../src/language/typescript/typescript-source-unit.js';
import { createProject } from '../ts-morph/create-project-fixture.js';
import { createSourceFile } from '../ts-morph/create-source-file-fixture.js';

export function createSourceUnit(
  code: string,
  path = '/packages/app/src/service.ts',
): TypeScriptSourceUnit {
  const project = createProject();

  const sourceFile = createSourceFile(project, code, path);

  return new TypeScriptSourceUnit(sourceFile);
}
