import { fileURLToPath } from 'node:url';

export const FIXTURE_PATHS = {
  cve: fileURLToPath(new URL('./CVE', import.meta.url)),
  lockfile: 'pnpm-lock-test.yaml',
  system: fileURLToPath(new URL('./filesystem', import.meta.url)),
  cves: {
    cve0570: fileURLToPath(new URL('./CVE/CVE-2026-0570.json', import.meta.url)),
    cve13149: fileURLToPath(new URL('./CVE/CVE-2026-13149.json', import.meta.url)),
    cve14257: fileURLToPath(new URL('./CVE/CVE-2026-14257.json', import.meta.url)),
    cve69152: fileURLToPath(new URL('./CVE/CVE-2026-69152.json', import.meta.url)),
  },
  securityWorkspace: fileURLToPath(new URL('./security-workspace', import.meta.url)),
  archWorkspace: fileURLToPath(new URL('./arch-workspace', import.meta.url)),
} as const;
