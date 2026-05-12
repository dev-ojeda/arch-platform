// packages\application\src\ports\workspace\workspace.port.ts
export interface WorkspacePort {
    getRootPath(): Promise<string | undefined>;

    exists(path: string): Promise<boolean>;
}