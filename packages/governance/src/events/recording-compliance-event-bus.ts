// packages/governance/src/events/recording-compliance-event-bus.ts

import type {
  ComplianceEvent,
  ComplianceEventBus,
  ComplianceEventHandler,
} from '@arch/platform-model';

export class RecordingComplianceEventBus implements ComplianceEventBus {
  readonly events: ComplianceEvent[] = [];

  readonly #handlers = new Set<ComplianceEventHandler>();

  subscribe(handler: ComplianceEventHandler): void {
    this.#handlers.add(handler);
  }

  unsubscribe(handler: ComplianceEventHandler): void {
    this.#handlers.delete(handler);
  }

  async publish(event: ComplianceEvent): Promise<void> {
    this.events.push(event);

    for (const handler of this.#handlers) {
      await handler.handle(event);
    }
  }
}
