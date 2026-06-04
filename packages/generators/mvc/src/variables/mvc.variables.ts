import type { TemplateVariables } from '@arch/contracts/variables';

export interface MvcVariables extends TemplateVariables {
  name: string;

  framework: string;

  language: string;

  useDocker?: boolean;
}
