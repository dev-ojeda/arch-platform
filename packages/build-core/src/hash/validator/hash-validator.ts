// packages/build-core/src/hash/validator/hash-validator.ts

import type { HashService } from '@arch/contracts';
import type { HashValidation } from '@arch/platform-model';

import { HashConsistencyError } from './hash-errors.js';

export class HashValidator {
  constructor(private readonly hashService: HashService) {}

  validate({ input, result }: HashValidation): void {
    const expected = this.hashService.hashObject(input);

    if (expected !== result.hash) {
      throw new HashConsistencyError(`Hash mismatch for ${input.nodeName}`, {
        expected: { hash: expected },
        actual: { hash: result.hash },
      });
    }
  }
}
