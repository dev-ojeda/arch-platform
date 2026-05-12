// packages\contracts\src\language.ts
export interface LanguageAdapter {
    id: string

    extension: string

    formatName(name: string): string

    controllerName(name: string): string

    serviceName(name: string): string

    repositoryName(name: string): string

    modelName(name: string): string

    folderLayout(): FolderLayout
}

export interface FolderLayout {
    controller: string
    service: string
    repository: string
    model: string
}