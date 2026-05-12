// generators/mvc/src/files.ts

import type {
    FileDefinition
} from '@arch/contracts'

export const mvcFiles =
    [

        /*
         * Controller
         */
        {
            template: 'controller.hbs',

            output: [
                '{{folders.controller}}',
                '{{controllerName}}{{extension}}'
            ].join('/')
        },

        /*
         * Service
         */
        {
            template: 'service.hbs',

            output: [
                '{{folders.service}}',
                '{{serviceName}}{{extension}}'
            ].join('/')
        },

        /*
         * Repository
         */
        {
            template: 'repository.hbs',

            output: [
                '{{folders.repository}}',
                '{{repositoryName}}{{extension}}'
            ].join('/')
        }
    ] as const satisfies FileDefinition[]