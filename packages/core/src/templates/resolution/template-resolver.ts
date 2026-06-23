// packages/core/src/templates/template-resolver.ts

import type { PathService, TechnologyStack } from '@arch/contracts';

export function resolveTemplateDir(
  pathService: PathService,
  generatorRoot: string,
  stack: TechnologyStack,
) {
  return pathService.join(
    generatorRoot,
    'templates',
    stack.languageId,
    stack.frameworkId ?? 'default',
  );
}
