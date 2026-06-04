// packages/domain-order/src/errors/invalid-order.error.ts
import { DomainError } from './domain-error.js';

export class InvalidOrderError extends DomainError {
  constructor(message: string) {
    super('INVALID_ORDER', message);
  }
}
