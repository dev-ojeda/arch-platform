// packages\generators\mvc\src\definition\index.ts
import type { GeneratorDefinition } from '@arch/contracts';

import { type MvcVariables } from '../variables/mvc.variables.js';

import { mvcDescriptor } from './descriptor.js';
import { mvcFiles } from './files.js';
import { mvcSchema } from './schema.js';

export const mvcGenerator: GeneratorDefinition<MvcVariables> = {
  descriptor: mvcDescriptor,

  schema: mvcSchema,

  templates: mvcFiles,
};
