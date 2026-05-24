// packages/infrastructure/src/templates/handlebars-template-engine.ts

import Handlebars from 'handlebars';

export function renderTemplate<TVariables extends object>(
  template: string,
  variables: TVariables,
): string {
  return Handlebars.compile(template)(variables);
}
