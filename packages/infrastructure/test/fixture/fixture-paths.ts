import { fileURLToPath } from 'node:url';

export const FIXTURE_PATHS = {
  cve: 'CVE',

  cves: {
    cve0570: 'CVE/CVE-2026-0570.json',
    cve13149: 'CVE/CVE-2026-13149.json',
    cve14257: 'CVE/CVE-2026-14257.json',
    cve69152: 'CVE/CVE-2026-69152.json',
  },

  system: fileURLToPath(new URL('./filesystem', import.meta.url)),
  securityWorkspace: fileURLToPath(new URL('./security-workspace', import.meta.url)),
  archWorkspace: fileURLToPath(new URL('./arch-workspace', import.meta.url)),
} as const;
