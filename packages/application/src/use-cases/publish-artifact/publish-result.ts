// packages/application/src/use-cases/publish-artifact/publish-result.ts

import type { PublicationEligibility } from '@arch-platform/platform-model';

export interface PublishResult {
  readonly success: boolean;
  readonly durationMs: number;
  readonly artifact: string;
  readonly version: string;
  readonly eligibility: PublicationEligibility;
}
