// packages/core/src/errors/base/base-error.ts
export interface ErrorOptions<TMetadata = unknown> {
  cause?: unknown;

  metadata?: TMetadata;
}

export abstract class BaseError<TMetadata = unknown> extends Error {
  readonly createdAt: Date;

  readonly metadata?: TMetadata;

  readonly cause?: unknown;

  protected constructor(message: string, options?: ErrorOptions<TMetadata>) {
    super(message);

    this.name = new.target.name;

    this.createdAt = new Date();

    this.metadata = options?.metadata;

    this.cause = options?.cause;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
