// packages/build-core/src/hash/validator/hash-validator.ts

import { createObjectHash } from '../hash-utils.js';

import { HashConsistencyError } from './hash-errors.js';
import type { HashValidation } from './hash-validation.js';

export class HashValidator {
  validate({ input, result }: HashValidation): void {
    const expected = createObjectHash(input);

    if (expected !== result.hash) {
      throw new HashConsistencyError(`Hash mismatch for ${input.nodeName}`, {
        expected: { hash: expected },
        actual: { hash: result.hash },
      });
    }
  }
}
