// packages\core\src\templates\template-resolver.ts

import * as path from 'path';

import type { TechnologyStack } from '@arch/contracts';

export function resolveTemplateDir(generatorRoot: string, stack: TechnologyStack) {
  return path.join(generatorRoot, 'templates', stack.languageId, stack.frameworkId ?? 'default');
}
