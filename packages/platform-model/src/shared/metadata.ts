// packages/platform-model/src/shared/metadata.ts

import type { Identifier } from "./identifier.js";

export interface Metadata {
  id: Identifier;

  name: string;

  description?: string;

  tags?: string[];
}
