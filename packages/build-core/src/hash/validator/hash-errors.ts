// packages/build-core/src/hash/validator/hash-errors.ts

export class HashConsistencyError extends Error {
  constructor(
    message: string,
    public readonly details?: unknown,
  ) {
    super(`[Hash] ${message}`);
    this.name = 'HashConsistencyError';
  }
}
