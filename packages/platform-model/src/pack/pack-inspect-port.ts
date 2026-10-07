// packages/platform-model/src/pack/pack-inspect-port.ts

import type { PackInspection } from './pack-inspection.js';

export interface PackInspectPort {
  inspect(content: Uint8Array): Promise<PackInspection>;
}
