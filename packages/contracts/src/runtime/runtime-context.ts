// packages/contracts/src/runtime/runtime-context.ts

import type { NamedVariables } from '../variables/named-variables.js';

import type { RuntimeDiagnosticLevel } from './runtime-diagnostic-level.js';

export interface RuntimeContext<TValues extends NamedVariables = NamedVariables> {
  readonly generator: string;

  readonly workingDirectory: string;

  readonly variables: TValues;

  readonly diagnostics: readonly RuntimeDiagnosticLevel[];

  readonly signal?: AbortSignal;
}
