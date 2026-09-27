// packages/infrastructure/src/config/security-config.ts

export interface SecurityConfig {
  readonly advisoryPath: string;
  readonly lockfilePath: string;
}

export function getSecurityConfig(lockfilePath?: string): SecurityConfig {
  return {
    advisoryPath: process.env.ARCH_SECURITY_ADVISORY_PATH ?? './data/security/cve',
    lockfilePath: lockfilePath ?? 'pnpm-lock.yaml',
  };
}
