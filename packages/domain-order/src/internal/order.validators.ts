// packages/domain-order/src/internal/order.validators.ts

import type { CreateOrderInput } from '../contracts/order-service.contract.js';
import { InvalidOrderError } from '../errors/index.js';

export function validateCreateOrderInput(input: CreateOrderInput): void {
  if (!input.customerId?.trim()) {
    throw new InvalidOrderError('customerId is required');
  }

  if (input.total <= 0) {
    throw new InvalidOrderError('total must be greater than zero');
  }
}
