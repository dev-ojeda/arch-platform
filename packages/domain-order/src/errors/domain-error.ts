// packages/domain-order/src/errors/domain-error.ts

export abstract class DomainError extends Error {
  readonly code: string;

  protected constructor(code: string, message: string) {
    super(message);

    this.name = new.target.name;
    this.code = code;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
