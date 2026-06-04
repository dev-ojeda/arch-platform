import type { NamedVariables } from '@arch/contracts/variables';

export interface MvcVariables extends NamedVariables {
  name: string;

  framework: string;

  language: string;

  useDocker?: boolean;
}
