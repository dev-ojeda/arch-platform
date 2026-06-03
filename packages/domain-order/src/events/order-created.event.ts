// packages/domain-order/src/events/order-created.event.ts
import type { Order } from '../models/order.js';

import type { DomainEvent } from './domain-event.js';

export interface OrderCreatedPayload {
  order: Order;
}

export class OrderCreatedEvent implements DomainEvent<OrderCreatedPayload> {
  readonly type = 'order.created';

  readonly occurredAt = new Date();

  constructor(readonly payload: OrderCreatedPayload) {}
}
