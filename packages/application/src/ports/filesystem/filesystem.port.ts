// packages\application\src\ports\filesystem\filesystem.port.ts
export interface FileSystemPort {
    readFile(path: string): Promise<string>;

    writeFile(
        path: string,
        content: string
    ): Promise<void>;

    createDirectory(path: string): Promise<void>;

    exists(path: string): Promise<boolean>;

    delete(path: string): Promise<void>;

    readDirectory(path: string): Promise<string[]>;
}