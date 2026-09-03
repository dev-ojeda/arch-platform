// packages/platform-model/src/compliance/events/compliance-event-bus.ts

import type { ComplianceEventHandler } from './compliance-event-handler.js';
import type { ComplianceEvent } from './compliance-event.js';

export interface ComplianceEventBus {
  publish(event: ComplianceEvent): Promise<void>;

  subscribe(handler: ComplianceEventHandler): void;
}
