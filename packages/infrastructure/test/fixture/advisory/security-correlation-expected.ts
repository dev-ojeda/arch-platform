// packages\infrastructure\test\fixture\advisory\create-security-correlation-advisoty.ts

export function createSecurityCorrelationAdvisory(): ReadonlyMap<string, readonly string[]> {
  return new Map([
    ['1.1.15', ['CVE-2026-13149', 'CVE-2026-14257', 'CVE-2026-69152']],
    ['2.1.1', ['CVE-2026-13149', 'CVE-2026-14257', 'CVE-2026-69152']],
    ['5.0.6', ['CVE-2026-13149', 'CVE-2026-14257', 'CVE-2026-69152']],
  ]);
}
