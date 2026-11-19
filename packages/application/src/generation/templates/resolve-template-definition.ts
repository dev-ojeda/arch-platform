// packages/application/src/generation/templates/resolve-template-definition.ts

import type { FileDefinition, NamedVariables, ResolvedTemplate } from '@arch-platform/contracts';

export function resolveTemplateDefinition<TVariables extends NamedVariables>(
  template: FileDefinition<TVariables>,
): ResolvedTemplate<TVariables> {
  return { template };
}
