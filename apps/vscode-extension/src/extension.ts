// apps/vscode-extension/src/extension.ts

import * as path from 'node:path'

import * as vscode from 'vscode'

import {
    GeneratorRuntime,
    listGenerators,
    NodeFileSystemAdapter
} from '@arch/core'

import {
    VSCodePromptAdapter
} from './adapters/vscode-prompt-adapter'

import {
    registerBuiltInGenerators
} from './activate.js'

export function activate(
    context: vscode.ExtensionContext
): void {

    console.log(
        '[arch] extension activated'
    )

    registerBuiltInGenerators()

    const runtime =
        new GeneratorRuntime({

            promptAdapter:
                new VSCodePromptAdapter(),

            templateRoot: path.join(

                context.extensionPath,

                'dist',

                'templates'
            )
        })

    const disposable =
        vscode.commands.registerCommand(

            'archgen.generate',

            async () => {

                /*
                 * Workspace validation
                 */
                const workspace =
                    vscode.workspace
                        .workspaceFolders?.[0]

                if (!workspace) {

                    vscode.window.showErrorMessage(
                        'No workspace opened'
                    )

                    return
                }

                /*
                 * Registered generators
                 */
                const generators =
                    listGenerators()

                /*
                 * Generator selection
                 */
                const selected =
                    await vscode.window
                        .showQuickPick(

                            generators.map(generator => ({

                                label:
                                    generator.name,

                                description:
                                    generator.description,

                                generator
                            })),

                            {
                                title:
                                    'Select architecture'
                            }
                        )

                if (!selected) {
                    return
                }

                try {

                    await runtime.execute(

                        selected.generator,

                        {

                            targetDir:
                                workspace.uri.fsPath,

                            fs:
                                new NodeFileSystemAdapter()
                        }
                    )

                    vscode.window.showInformationMessage(

                        `${selected.generator.name} generated successfully`
                    )

                } catch (error) {

                    console.error(error)

                    vscode.window.showErrorMessage(

                        error instanceof Error
                            ? error.message
                            : 'Unknown generator error'
                    )
                }
            }
        )

    context.subscriptions.push(
        disposable
    )
}

export function deactivate(): void {}