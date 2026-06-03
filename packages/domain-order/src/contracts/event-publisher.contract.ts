// packages/domain-order/src/contracts/event-publisher.contract.ts

import type { DomainEvent } from '../events/domain-event.js';

export interface EventPublisherContract {
  publish(event: DomainEvent<unknown>): Promise<void>;
}
