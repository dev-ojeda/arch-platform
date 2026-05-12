// generators/mvc/src/mvc-generator.ts

import type {
    GeneratorDefinition
} from '@arch/contracts'

import {
    mvcFiles
} from './files.js'

import {
    mvcSchema
} from './schema.js'

export const mvcGenerator: GeneratorDefinition = {

    id: 'mvc',

    name: 'MVC',

    description:
        'Classic MVC architecture',

    version: '1.0.0',

    schema: mvcSchema,

    templates: mvcFiles,

    capabilities: {

        languages: [
            'typescript'
        ],

        frameworks: [
            'express'
        ],

        tags: [
            'backend',
            'mvc',
            'express'
        ]
    }
} 