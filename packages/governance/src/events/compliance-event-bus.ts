// packages/governance/src/events/compliance-event-bus.ts

import type {
  ComplianceEvent,
  ComplianceEventBus,
  ComplianceEventHandler,
} from '@arch/platform-model';

export class InMemoryComplianceEventBus implements ComplianceEventBus {
  private readonly handlers: ComplianceEventHandler[] = [];

  subscribe(handler: ComplianceEventHandler): void {
    this.handlers.push(handler);
  }

  async publish(event: ComplianceEvent): Promise<void> {
    await Promise.all(this.handlers.map((handler) => handler.handle(event)));
  }
}
