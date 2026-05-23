// packages/contracts/src/generation/generation-request.ts
import type { FileSystemPort } from '../filesystem/filesystem.port.js';
import type { GeneratorDefinition } from '../generators/generator-definition.js';
import type { LoggerPort } from '../logging/logger.port.js';
import type { NamedVariables } from '../variables/named-variables.js';

export interface GenerationRequest<TVariables extends NamedVariables = NamedVariables> {
  generator: GeneratorDefinition<TVariables>;

  targetDir: string;

  variables?: Partial<TVariables>;

  fs?: FileSystemPort;

  logger?: LoggerPort;

  signal?: AbortSignal;
}
