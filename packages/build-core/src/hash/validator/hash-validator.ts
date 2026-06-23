// packages/build-core/src/hash/validator/hash-validator.ts

import { createObjectHash } from '../hash-utils.js';

import { HashConsistencyError } from './hash-errors.js';
import type { HashValidation } from './hash-validation.js';

export class HashValidator {
  validate({ input, result }: HashValidation): void {
    if (
      input.sourceHash !== result.sourceHash ||
      input.configHash !== result.configHash ||
      input.depsHash !== result.depsHash
    ) {
      throw new HashConsistencyError(`Hash components mismatch for ${input.nodeName}`, {
        expected: {
          sourceHash: input.sourceHash,
          configHash: input.configHash,
          depsHash: input.depsHash,
        },
        actual: {
          sourceHash: result.sourceHash,
          configHash: result.configHash,
          depsHash: result.depsHash,
        },
      });
    }

    const expected = createObjectHash(input);

    if (expected !== result.hash) {
      throw new HashConsistencyError(`Hash mismatch for ${input.nodeName}`);
    }
  }
}
