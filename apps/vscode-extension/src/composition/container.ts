// apps\vscode-extension\src\composition\container.ts
import {
    VSCodeNotificationAdapter
} from '../adapters/vscode/notifications/vscode-notification.adapter.js';

import {
    VSCodeWorkspaceAdapter
} from '../adapters/vscode/workspace/vscode-workspace.adapter.js';

import {
    NodeFileSystemAdapter
} from '../infrastructure/filesystem/node-filesystem.adapter';

export function createContainer() {

    const notifications =
        new VSCodeNotificationAdapter();

    const workspace =
        new VSCodeWorkspaceAdapter();

    const filesystem =
        new NodeFileSystemAdapter();

    return {
        notifications,
        workspace,
        filesystem
    };
}