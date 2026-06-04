// packages/domain-order/src/internal/in-memory-order.repository.ts

import type { OrderRepositoryContract } from '../contracts/order-repository.contract.js';
import type { Order } from '../models/order.js';
import type { OrderId } from '../value-objects/order-id.js';

export class InMemoryOrderRepository implements OrderRepositoryContract {
  readonly #orders = new Map<string, Order>();

  save(order: Order): Promise<void> {
    this.#orders.set(order.id.toString(), order);

    return Promise.resolve();
  }

  findById(id: OrderId): Promise<Order | null> {
    return Promise.resolve(this.#orders.get(id.toString()) ?? null);
  }
}
