// packages/domain-order/src/value-objects/customer-id.ts
import { InvalidOrderError } from '../errors/index.js';

export class CustomerId {
  readonly value: string;

  constructor(value: string) {
    if (!value?.trim()) {
      throw new InvalidOrderError('customer id cannot be empty');
    }

    this.value = value;
  }

  toString(): string {
    return this.value;
  }
}
