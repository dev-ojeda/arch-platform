// packages/platform-model/src/compliance/events/compliance-event.ts

import type { ComplianceEventName } from './compliance-event-name.js';

export interface ComplianceEvent {
  readonly name: ComplianceEventName;

  readonly timestamp: number;

  readonly payload?: Record<string, unknown>;
}
