// packages/domain-order/src/models/order.ts

import type { OrderStatus } from './order-status.js';
import type { CustomerId } from '../value-objects/customer-id.js';
import type { Money } from '../value-objects/money.js';
import type { OrderId } from '../value-objects/order-id.js';


export interface Order {
  id: OrderId;
  customerId: CustomerId;
  total: Money;
  createdAt: Date;
  status: OrderStatus;
}
