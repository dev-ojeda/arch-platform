// packages\application\src\ports\filesystem\filesystem.port.ts

export interface WriteFileInput {
    path: string;
    content: string;
}
export interface FileSystemPort {
    readFile(path: string): Promise<string>;

    writeFiles(
        files: WriteFileInput[],
        destination: string,
    ): Promise<void>;

    createDirectory(path: string): Promise<void>;

    exists(path: string): Promise<boolean>;

    delete(path: string): Promise<void>;

    readDirectory(path: string): Promise<string[]>;
}