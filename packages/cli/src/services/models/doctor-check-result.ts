// packages/cli/src/services/models/doctor-check-result.ts
export interface DoctorCheckResult {
  name: string;
  success: boolean;
  message: string;
  details: string[];
}
