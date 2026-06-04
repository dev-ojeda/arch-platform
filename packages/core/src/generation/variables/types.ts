// packages\core\src\variables\types.ts

import type { FolderLayout } from '@arch/contracts/languages';

export interface DerivedTemplateVariables {
  className: string;

  controllerName: string;

  serviceName: string;

  repositoryName: string;

  modelName: string;

  fileExtension: string;

  folderLayout: FolderLayout;
}

export type ResolvedTemplateVariables<TVariables> = TVariables & DerivedTemplateVariables;
