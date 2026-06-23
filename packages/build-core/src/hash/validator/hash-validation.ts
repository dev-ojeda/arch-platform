// packages/build-core/src/hash/validator/hash-validation.ts

import type { HashInput } from '../hash-input.js';
import type { HashResult } from '../hash-result.js';

export interface HashValidation {
  input: HashInput;
  result: HashResult;
}
