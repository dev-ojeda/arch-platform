// packages\domain-order\src\test\domain-order.spec.test.ts
import { describe, expect, it } from 'vitest';

import { InvalidOrderError } from '../src/errors/invalid-order.error.js';
import { OrderNotFoundError } from '../src/errors/order-not-found.error.js';
import { InMemoryEventPublisher } from '../src/internal/in-memory-event.publisher.js';
import { InMemoryOrderRepository } from '../src/internal/in-memory-order.repository.js';
import { OrderService } from '../src/services/order.service.js';

describe('OrderService', () => {
  it('should create an order', async () => {
    const repository = new InMemoryOrderRepository();

    const publisher = new InMemoryEventPublisher();

    const service = new OrderService(repository, publisher);

    const order = await service.create({
      customerId: 'customer-001',
      total: 100,
    });

    expect(order.customerId.toString()).toBe('customer-001');

    expect(order.total.amount).toBe(100);
  });

  it('should find an order by id', async () => {
    const repository = new InMemoryOrderRepository();

    const publisher = new InMemoryEventPublisher();

    const service = new OrderService(repository, publisher);

    const created = await service.create({
      customerId: 'customer-001',
      total: 100,
    });

    const found = await service.findById(created.id.toString());

    expect(found).not.toBeNull();

    expect(found.id.toString()).toBe(created.id.toString());
  });

  it('should throw when order does not exist', async () => {
    const repository = new InMemoryOrderRepository();

    const publisher = new InMemoryEventPublisher();

    const service = new OrderService(repository, publisher);

    await expect(service.findById('missing-order')).rejects.toThrow(OrderNotFoundError);
  });

  it('should validate total amount', async () => {
    const repository = new InMemoryOrderRepository();

    const publisher = new InMemoryEventPublisher();

    const service = new OrderService(repository, publisher);

    await expect(
      service.create({
        customerId: 'customer-001',
        total: 0,
      }),
    ).rejects.toThrow(InvalidOrderError);
  });
});
