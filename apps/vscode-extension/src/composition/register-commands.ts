// apps\vscode-extension\src\commands\register-commands.ts
import * as vscode from 'vscode'

import type {
    ExtensionContext
} from 'vscode'

import type {
    Container
} from './container.js'

export function registerCommands(
    container: Container,

    context: ExtensionContext
): void {

    context.subscriptions.push(

        vscode.commands.registerCommand(

            'arch.generateProject',

            async () => {
                console.log(
                    '[arch] executing generate project command'
                )
                const workspace =
                    vscode.workspace
                        .workspaceFolders?.[0]
                console.log(
                    '[arch] workspace:',
                    workspace?.uri.fsPath
                )
                if (!workspace) {

                    vscode.window
                        .showErrorMessage(
                            'No workspace opened'
                        )

                    return
                }

                await container
                    .generateProjectUseCase
                    .execute({

                        generatorId:
                            'mvc',

                        targetDir:
                            workspace.uri.fsPath
                    })

                vscode.window
                    .showInformationMessage(
                        'Project generated successfully'
                    )
            }
        )
    )
}