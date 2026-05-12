// packages\contracts\src\filesystem.ts

export interface FileSystemAdapter {
    read(filePath: string): Promise<string>
    write(
        filePath: string,
        content: string,
        options?: {
            overwrite?: OverwritePolicy
        }
    ): Promise<void>
}

export type OverwritePolicy =
    | 'skip'
    | 'overwrite'
    | 'error'