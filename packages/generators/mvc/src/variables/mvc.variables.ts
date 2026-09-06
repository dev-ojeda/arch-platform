import type { TemplateVariables } from '@arch-platform/contracts';

export interface MvcVariables extends TemplateVariables {
  name: string;

  framework: string;

  language: string;

  useDocker?: boolean;
}
