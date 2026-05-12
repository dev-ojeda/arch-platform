// generators\mvc\src\schema.ts

import type { PromptSchema } from '@arch/contracts'

export const mvcSchema: PromptSchema = {
    id: 'mvc',

    title: 'MVC Generator',

    description:
        'Generate a classic MVC structure',

    version: '1.0.0',

    fields: [
        {
            type: 'select',

            name: 'language',

            message: 'Select language',

            required: true,

            defaultValue: 'typescript',

            options: [
                {
                    label: 'TypeScript',
                    value: 'typescript'
                }
            ]
        },

        {
            type: 'select',

            name: 'framework',

            message: 'Select framework',

            required: true,

            defaultValue: 'express',

            options: [
                {
                    label: 'Express',
                    value: 'express'
                }
            ]
        },

        {
            type: 'string',

            name: 'name',

            message: 'Module name',

            required: true,

            minLength: 2,

            pattern: /^[a-zA-Z0-9-_]+$/,

            validate(value) {
                return /^[a-zA-Z0-9-_]+$/.test(value)
                    ? undefined
                    : 'Invalid module name'
            }
        }
    ]
}