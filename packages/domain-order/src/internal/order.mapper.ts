// packages/domain-order/src/internal/order.mapper.ts
import type { CreateOrderInput } from '../contracts/order-service.contract.js';
import { OrderStatus } from '../models/order-status.js';
import type { Order } from '../models/order.js';
import { CustomerId } from '../value-objects/customer-id.js';
import { Money } from '../value-objects/money.js';
import { OrderId } from '../value-objects/order-id.js';

export function toOrder(input: CreateOrderInput): Order {
  return {
    id: new OrderId(crypto.randomUUID()),
    customerId: new CustomerId(input.customerId),
    total: new Money(input.total),
    createdAt: new Date(),
    status: OrderStatus.PENDING,
  };
}
