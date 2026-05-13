import * as vscode from 'vscode';

import type {
    NotificationPort
} from '@arch/application';

export class VSCodeNotificationAdapter
    implements NotificationPort {

    async info(
        message: string
    ): Promise<void> {
        vscode.window.showInformationMessage(
            message
        );
    }

    async warn(
        message: string
    ): Promise<void> {
        vscode.window.showWarningMessage(
            message
        );
    }

    async error(
        message: string
    ): Promise<void> {
        vscode.window.showErrorMessage(
            message
        );
    }
}