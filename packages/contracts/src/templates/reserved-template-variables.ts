// packages\contracts\src\templates\reserved-template-variables.ts

export const RESERVED_TEMPLATE_VARIABLES = [
  'className',

  'controllerName',

  'serviceName',

  'repositoryName',

  'modelName',

  'fileExtension',

  'folderLayout',
] as const;

export type ReservedTemplateVariable = (typeof RESERVED_TEMPLATE_VARIABLES)[number];
