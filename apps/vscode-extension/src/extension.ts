// apps/vscode-extension/src/extension.ts

import type {
    ExtensionContext
} from 'vscode';

import {
    createContainer
} from './composition/container.js';

import {
    registerCommands
} from './composition/register-commands.js';

export async function activate(context: ExtensionContext) {
    const container = createContainer(context);

    registerCommands(container, context);
}

export function deactivate() { }