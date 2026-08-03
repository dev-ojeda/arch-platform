// test/fixtures/language/create-source-reader-fixture.ts

import { createTypeScriptLanguage } from '../../../src/language/create-typescript-language.js';
import type { SourceReader } from '../../../src/language/typescript/source/source-reader.js';
import { createProject } from '../ts-morph/create-project-fixture.js';
import { createSourceFile } from '../ts-morph/create-source-file-fixture.js';

export function createSourceReader(code: string): SourceReader {
  const project = createProject();

  createSourceFile(project, code);

  return createTypeScriptLanguage(project);
}
