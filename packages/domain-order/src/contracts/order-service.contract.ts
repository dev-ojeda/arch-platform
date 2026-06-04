// packages/domain-order/src/contracts/order-service.contract.ts

import type { Order } from '../models/order.js';

export interface CreateOrderInput {
  customerId: string;
  total: number;
}

export interface OrderServiceContract {
  create(input: CreateOrderInput): Promise<Order>;
  findById(id: string): Promise<Order | null>;
}
