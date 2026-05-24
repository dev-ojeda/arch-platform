import type { PromptSchema } from '@arch/contracts';

import type { MvcVariables } from '../variables/mvc.variables.js';

export const mvcSchema: PromptSchema<MvcVariables> = {
  id: 'mvc-schema',

  title: 'MVC Generator',

  fields: [
    {
      type: 'string',
      name: 'name',
      message: 'Project name',
      required: true,
    },
    {
      type: 'boolean',
      name: 'useDocker',
      message: 'Use Docker?',
      defaultValue: false,
    },
  ],
};
