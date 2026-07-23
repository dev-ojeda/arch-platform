// packages/infrastructure/src/filesystem/io/retry-fs-operation.ts

import { isRetryableFsError } from './retryable-errors.js';
import { sleep } from './sleep.js';

export async function retryFsOperation<T>(
  operation: () => Promise<T>,
  retries = 5,
  delay = 50,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isRetryableFsError(error)) {
        throw error;
      }

      await sleep(delay * (attempt + 1));
    }
  }

  throw lastError;
}
