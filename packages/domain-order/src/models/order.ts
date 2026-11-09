// packages/domain-order/src/models/order.ts

import { OrderStatus } from './order-status.js';
import { CustomerId, Money, OrderId } from '../value-objects/index.js';


export interface Order {
  id: OrderId;
  customerId: CustomerId;
  total: Money;
  createdAt: Date;
  status: OrderStatus;
}
