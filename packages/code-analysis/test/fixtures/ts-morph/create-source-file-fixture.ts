// packages\code-analysis\test\fixtures\ts-morph\create-source-file-fixture.ts

import type { Project, SourceFile } from 'ts-morph';

export function createSourceFile(
  project: Project,
  code: string,
  path = '/packages/app/src/service.ts',
): SourceFile {
  return project.createSourceFile(path, code);
}
