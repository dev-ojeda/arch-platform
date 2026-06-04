// packages/contracts/src/runtime/runtime-diagnostic.ts

import type { RuntimeDiagnosticLevel } from './runtime-diagnostic-level.js';
import type { RuntimeMetadata } from './runtime-metadata.js';

export interface RuntimeDiagnostic {
  readonly level: RuntimeDiagnosticLevel;

  readonly message: string;

  readonly code?: string;

  readonly metadata?: RuntimeMetadata;

  readonly error?: unknown;
}
