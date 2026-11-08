// packages/contracts/src/runtime/runtime-context.ts


import type { RuntimeDiagnostic } from './runtime-diagnostic.js';
import type { RuntimeMetadata } from './runtime-metadata.js';
import type { NamedVariables } from '../variables/named-variables.js';

export interface RuntimeContext<TValues extends NamedVariables = NamedVariables> {
  readonly generatorId: string;

  readonly workingDirectory: string;

  readonly variables: TValues;

  readonly diagnostics: readonly RuntimeDiagnostic[];

  readonly metadata?: RuntimeMetadata;

  readonly signal?: AbortSignal;
}
