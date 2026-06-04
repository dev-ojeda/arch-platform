// packages/domain-order/src/errors/order-not-found.error.ts
import { DomainError } from './domain-error.js';

export class OrderNotFoundError extends DomainError {
  constructor(orderId: string) {
    super('ORDER_NOT_FOUND', `Order with id "${orderId}" was not found`);
  }
}
