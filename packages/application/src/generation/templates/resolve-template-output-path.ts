// packages/application/src/generation/templates/resolve-template-output-path.ts

import type { NamedVariables } from '@arch/contracts';
import Handlebars from 'handlebars';

export function resolveTemplateOutputPath(
  output: string,

  variables: NamedVariables,
): string {
  return Handlebars.compile(output)(variables);
}
