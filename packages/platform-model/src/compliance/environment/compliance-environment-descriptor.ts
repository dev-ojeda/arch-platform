// packages/platform-model/src/compliance/environment/compliance-environment-descriptor.ts

import type { ComplianceEnvironment } from './compliance-environment.js';

export interface ComplianceEnvironmentDescriptor {
  readonly name: ComplianceEnvironment;
  readonly order: number;
  readonly schemaVersion: number;
}
