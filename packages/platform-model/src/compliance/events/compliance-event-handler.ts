// packages/platform-model/src/compliance/events/compliance-event-handler.ts

import type { ComplianceEvent } from './compliance-event.js';

export interface ComplianceEventHandler {
  handle(event: ComplianceEvent): Promise<void>;
}
