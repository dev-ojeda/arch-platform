// apps\vscode-extension\src\commands\register-commands.ts
import * as vscode from 'vscode';

import type {
    ExtensionContext
} from 'vscode';

import type {
    createContainer
} from './container';

type Container =
    ReturnType<typeof createContainer>;

export function registerCommands(
    context: ExtensionContext,
    container: Container
) {

    context.subscriptions.push(

        vscode.commands.registerCommand(
            'archgen.generate',

            async () => {

                await container.notifications.info(
                    'Architecture generation started'
                );
            }
        )
    );
}