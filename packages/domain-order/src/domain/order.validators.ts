// packages/domain-order/src/domain/order.validators.ts

import { InvalidOrderError } from '../errors/invalid-order.error.js';

import type { CreateOrderInput } from '../contracts/order-service.contract.js';

export function validateCreateOrderInput(input: CreateOrderInput): void {
  if (!input.customerId?.trim()) {
    throw new InvalidOrderError('customerId is required');
  }

  if (input.total <= 0) {
    throw new InvalidOrderError('total must be greater than zero');
  }
}
