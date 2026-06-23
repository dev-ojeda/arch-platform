import type { TemplateVariables } from '@arch/contracts';

export interface MvcVariables extends TemplateVariables {
  name: string;

  framework: string;

  language: string;

  useDocker?: boolean;
}
