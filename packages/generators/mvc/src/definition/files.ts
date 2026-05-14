// generators/mvc/src/files.ts
import type {
    FileDefinition,
    ResolvedTemplateVariables
} from '@arch/contracts'

import type {
    MvcVariables
} from '../variables/mvc.variables.js'

export const mvcFiles:
    readonly FileDefinition<
        ResolvedTemplateVariables<MvcVariables>
    >[] = [
        {
            template: 'controller.hbs',

            output:
                '{{folderLayout.controller}}/{{controllerName}}{{fileExtension}}'
        },
        {
            template: 'service.hbs',

            output:
                '{{folderLayout.service}}/{{serviceName}}{{fileExtension}}'
        },
        {
            template: 'repository.hbs',

            output:
                '{{folderLayout.repository}}/{{repositoryName}}{{fileExtension}}'
        },
        {
            template: 'model.hbs',

            output:
                '{{folderLayout.model}}/{{modelName}}{{fileExtension}}'
        }
    ]