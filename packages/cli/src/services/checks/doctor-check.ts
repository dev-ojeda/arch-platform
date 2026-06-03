// packages/cli/src/services/checks/doctor-check.ts

import type { DoctorCheckResult } from '../models/doctor-check-result.js';

export interface DoctorCheck {
  name: string;

  run(): DoctorCheckResult | Promise<DoctorCheckResult>;
}
