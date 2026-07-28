// packages/build-core/src/logging/trace-config.ts

export type TraceCategory = 'cache' | 'hash' | 'graph' | 'executor' | 'planner';

export const TRACE_ENABLED = process.env.ARCH_BUILD_TRACE === '1';

export const TRACE_CACHE_ENABLED = process.env.ARCH_BUILD_TRACE_CACHE === '1';

export const TRACE_HASH_ENABLED = process.env.ARCH_BUILD_TRACE_HASH === '1';
