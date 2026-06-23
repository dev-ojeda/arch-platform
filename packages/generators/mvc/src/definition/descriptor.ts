import type { GeneratorDescriptor } from '@arch/contracts';

export const mvcDescriptor: GeneratorDescriptor = {
  id: 'mvc',

  displayName: 'MVC Generator',

  description: 'Generates MVC applications',

  version: '1.0.0',

  languages: ['typescript'],

  frameworks: ['express'],

  category: 'backend',

  tags: ['mvc', 'express', 'typescript'],
};
