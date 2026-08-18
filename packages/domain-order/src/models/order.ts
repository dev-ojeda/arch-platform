// packages/domain-order/src/models/order.ts

import { CustomerId, Money, OrderId } from '../value-objects/index.js';

import { OrderStatus } from './order-status.js';

export interface Order {
  id: OrderId;
  customerId: CustomerId;
  total: Money;
  createdAt: Date;
  status: OrderStatus;
}
