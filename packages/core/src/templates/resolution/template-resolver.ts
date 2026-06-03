// packages/core/src/templates/template-resolver.ts

import type { PathService } from '@arch/contracts/runtime';
import type { TechnologyStack } from '@arch/contracts/stacks';

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
