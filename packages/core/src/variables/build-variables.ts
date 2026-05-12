// packages/core/variables/build-variables.ts

import type {
    GenerationContext,
    NamedVariables
} from '@arch/contracts'

import {
    getLanguage
} from '@arch/language-registry'

import type {
    ResolvedTemplateVariables
} from './types.js'

export function buildVariables<
    TVariables extends NamedVariables
>(
    ctx: GenerationContext<TVariables>
): ResolvedTemplateVariables<TVariables> {

    /*
     * Backward compatibility
     */
    const languageId =
        ctx.stack?.language ??
        'typescript'

    const language =
        getLanguage(languageId)

    const name =
        ctx.variables.name

    return {

        ...ctx.variables,

        className:
            language.formatName(name),

        controllerName:
            language.controllerName(name),

        serviceName:
            language.serviceName(name),

        repositoryName:
            language.repositoryName(name),

        modelName:
            language.modelName(name),

        extension:
            language.extension,

        folders:
            language.folderLayout()
    }
}