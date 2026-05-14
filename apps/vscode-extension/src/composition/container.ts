// apps\vscode-extension\src\composition\container.ts
import { NodeFileSystemAdapter } from '../../../../packages/infrastructure/src/index.js';
import {
    VSCodeNotificationAdapter
} from '../adapters/vscode/notifications/vscode-notification.adapter.js';

import {
    VSCodeWorkspaceAdapter
} from '../adapters/vscode/workspace/vscode-workspace.adapter.js';


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