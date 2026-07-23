// packages\infrastructure\src\logging\trace-config.ts
export const TRACE_ENABLED = ['1', 'true', 'yes', 'on'].includes(
  (process.env.ARCH_TRACE ?? '').toLowerCase(),
);

export const TRACE_COMPONENT = process.env.ARCH_TRACE_COMPONENT;
export function isTraceEnabled(): boolean {
  return ['1', 'true', 'yes', 'on'].includes((process.env.ARCH_TRACE ?? '').toLowerCase());
}

export function getTraceComponent(): string | undefined {
  return process.env.ARCH_TRACE_COMPONENT;
}
