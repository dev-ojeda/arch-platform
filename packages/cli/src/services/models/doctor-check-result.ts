// packages/cli/src/services/models/doctor-check-result.ts
export type DoctorCheckSeverity = 'error' | 'warning' | 'info';

export interface DoctorCheckResult {
  severity: DoctorCheckSeverity;

  message: string;

  details?: string[];
}
