// packages/domain-order/src/internal/in-memory-event.publisher.ts

import type { EventPublisherContract } from '../contracts/event-publisher.contract.js';
import type { DomainEvent } from '../events/domain-event.js';

export class InMemoryEventPublisher implements EventPublisherContract {
  readonly events: DomainEvent<unknown>[] = [];

  publish(event: DomainEvent<unknown>): Promise<void> {
    this.events.push(event);

    return Promise.resolve();
  }
}
