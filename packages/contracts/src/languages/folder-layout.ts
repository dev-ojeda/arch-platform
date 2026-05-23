//packages\contracts\src\languages\folder-layout.ts
import type { VariableObject } from '../variables/variable-value.js';

export interface FolderLayout extends VariableObject {
  readonly controller: string;

  readonly service: string;

  readonly repository: string;

  readonly model: string;
}
