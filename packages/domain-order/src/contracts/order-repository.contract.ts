// packages/domain-order/src/contracts/order-repository.contract.ts

import type { Order } from '../models/order.js';
import { OrderId } from '../value-objects/order-id.js';

export interface OrderRepositoryContract {
  save(order: Order): Promise<void>;

  findById(id: OrderId): Promise<Order | null>;
}
