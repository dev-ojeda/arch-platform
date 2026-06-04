// packages/domain-order/src/value-objects/money.ts
import { InvalidOrderError } from '../errors/index.js';

export class Money {
  readonly amount: number;

  constructor(amount: number) {
    if (amount <= 0) {
      throw new InvalidOrderError('money amount must be greater than zero');
    }

    this.amount = amount;
  }

  toString(): string {
    return this.amount.toFixed(2);
  }
}
