import { GenerationError } from './generation-error.js';

export class GeneratorValidationError extends GenerationError {
  constructor(message: string) {
    super(message);

    this.name = 'GeneratorValidationError';
  }
}
