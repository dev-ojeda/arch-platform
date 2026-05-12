// packages\core\src\engine\orchestration\run-generator.ts

import type {
    GenerationContext,
    Generator,
    NamedVariables
} from '@arch/contracts'

import { consoleLogger } from '../../logging/console-logger.js'
import { NodeFileSystemAdapter } from '../filesystem/node-fs-adapter.js'
export interface RunGeneratorOptions<
TVariables extends NamedVariables
> {

    generator: Generator<TVariables>

    context: Omit<
        GenerationContext<TVariables>,
        'logger' | 'fs'
    > & {

        logger?: GenerationContext<TVariables>['logger']

        fs?: GenerationContext<TVariables>['fs']
    }
}

export async function runGenerator<
TVariables extends NamedVariables
>(
    options: RunGeneratorOptions<TVariables>
): Promise<void> {

    const {
        generator,
        context
    } = options

    await generator.generate({

        /*
         * NEW
         */
        stack: context.stack,

        variables: context.variables,

        targetDir: context.targetDir,

        logger:
            context.logger ??
            consoleLogger,

        fs:
            context.fs ??
            new NodeFileSystemAdapter(),

        signal: context.signal
    })
}