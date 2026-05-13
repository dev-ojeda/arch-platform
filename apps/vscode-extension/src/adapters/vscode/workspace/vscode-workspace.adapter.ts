import * as vscode from 'vscode';

import type {
    WorkspacePort
} from '@arch/application';

export class VSCodeWorkspaceAdapter
    implements WorkspacePort {

    async getRootPath():
        Promise<string | undefined> {

        return vscode.workspace
            .workspaceFolders?.[0]
            ?.uri.fsPath;
    }

    async exists(
        path: string
    ): Promise<boolean> {

        try {
            await vscode.workspace.fs.stat(
                vscode.Uri.file(path)
            );

            return true;

        } catch {
            return false;
        }
    }
}