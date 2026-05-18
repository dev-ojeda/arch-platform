// packages/application/testing/test-generator.ts

import type {
  GeneratorDefinition
}
from '@arch/contracts'

export const testGenerator:
GeneratorDefinition = {

  descriptor: {

    id:
      'test-generator',

    displayName:
      'Test Generator',

    version:
      '1.0.0',

    languages: [
      'typescript'
    ],

    frameworks: [
      'vitest'
    ]
  },

  schema: {

    id:
      'test-schema',

    title:
      'Test Schema',

    fields: []
  },

  templates: [

    {

      template:
        'service.hbs',

      output:
        'user.service.ts'
    }
  ]
}