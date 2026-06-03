// packages/domain-order/src/test/factories/create-order-service.ts

import { InMemoryEventPublisher } from '../../src/internal/in-memory-event.publisher.js';
import { InMemoryOrderRepository } from '../../src/internal/in-memory-order.repository.js';
import { OrderService } from '../../src/services/order.service.js';

export function createOrderService() {
  const repository = new InMemoryOrderRepository();

  const publisher = new InMemoryEventPublisher();

  const service = new OrderService(repository, publisher);

  return {
    service,
    repository,
    publisher,
  };
}
