// packages/domain-order/src/domain/order.mapper.ts
import { OrderStatus } from '../models/order-status.js';
import { CustomerId } from '../value-objects/customer-id.js';
import { Money } from '../value-objects/money.js';
import { OrderId } from '../value-objects/order-id.js';

import type { CreateOrderInput } from '../contracts/order-service.contract.js';
import type { Order } from '../models/order.js';

export function toOrder(input: CreateOrderInput): Order {
  return {
    id: new OrderId(crypto.randomUUID()),
    customerId: new CustomerId(input.customerId),
    total: new Money(input.total),
    createdAt: new Date(),
    status: OrderStatus.PENDING,
  };
}
