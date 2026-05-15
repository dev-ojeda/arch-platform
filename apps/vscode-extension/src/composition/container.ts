// apps\vscode-extension\src\composition\container.ts
import * as path from 'node:path'

import type {
    ExtensionContext
} from 'vscode'

import {
    GeneratorRegistry,
    LanguageConventionRegistry,
    TypeScriptConvention
} from '@arch/core'

import {
    GeneratorRuntime,
    GenerateProjectUseCase
} from '@arch/application'

import {
    NodeFileSystemAdapter
} from '@arch/infrastructure'

import {
    registerMvcGenerator
} from '@arch/generator-mvc'

import {
    VSCodePromptAdapter
} from '../adapters/vscode-prompt-adapter.js'

export interface Container {

    generateProjectUseCase:
        GenerateProjectUseCase
}

export function createContainer(
    context: ExtensionContext
): Container {

    /*
     * Language registry
     */
    const languageRegistry =
        new LanguageConventionRegistry()

    languageRegistry.register(
        new TypeScriptConvention()
    )

    /*
     * Generator registry
     */
    const generatorRegistry =
        new GeneratorRegistry()

    registerMvcGenerator(
        generatorRegistry
    )

    /*
     * Runtime
     */
    const runtime =
        new GeneratorRuntime({

            promptAdapter:
                new VSCodePromptAdapter(),

            templateRoot:
                path.resolve(
                    context.extensionPath,
                    'dist/templates'
                ),

            languageRegistry,

            defaultFs:
                new NodeFileSystemAdapter()
        })

    /*
     * Use cases
     */
    const generateProjectUseCase =
        new GenerateProjectUseCase(

            generatorRegistry,

            runtime
        )

    return {

        generateProjectUseCase
    }
}