// packages/generators/mvc/src/definition/generate-mvc.ts

import type { GeneratorDefinition } from '@arch/contracts';


import { mvcDescriptor } from './descriptor.js';
import { mvcFiles } from './files.js';
import { mvcSchema } from './schema.js';

import type { MvcVariables } from '../variables/mvc.variables.js';

export const mvcGenerator: GeneratorDefinition<MvcVariables> = {
  descriptor: mvcDescriptor,

  schema: mvcSchema,

  templates: mvcFiles,
};
