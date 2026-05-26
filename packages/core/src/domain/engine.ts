// packages/core/src/domain/engine.ts

import type { Diagnostic } from './diagnostic.js';

export interface Engine<TInput = unknown> {
  execute(input: TInput): Promise<Diagnostic[]>;
}
