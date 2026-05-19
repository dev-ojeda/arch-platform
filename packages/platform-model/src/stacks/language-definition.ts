// packages/platform-model/src/stacks/language-definition.ts

import type { LanguageId } from "../shared/identifier.js";
import type { Metadata } from "../shared/metadata.js";

export interface LanguageDefinition extends Metadata {
  id: LanguageId;

  extensions: string[];

  runtime?: string;

  packageManager?: string;
}
