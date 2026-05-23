// packages\contracts\src\languages\language-convention.ts

import type { FolderLayout } from './folder-layout.js';

export interface LanguageConvention {
  id: string;

  fileExtension: string;

  folderLayout: FolderLayout;

  formatName(name: string): string;

  controllerName(name: string): string;

  serviceName(name: string): string;

  repositoryName(name: string): string;

  modelName(name: string): string;
}
