// packages/domain-order/src/value-objects/order-id.ts
import { InvalidOrderError } from '../errors/index.js';

export class OrderId {
  readonly value: string;

  constructor(value: string) {
    if (!value?.trim()) {
      throw new InvalidOrderError('order id cannot be empty');
    }

    this.value = value;
  }

  toString(): string {
    return this.value;
  }
}
