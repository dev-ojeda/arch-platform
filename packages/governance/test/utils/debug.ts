// packages/governance/test/utils/debug.ts

export function debug(value: unknown): void {
  console.log('\n=== DEBUG ===\n' + JSON.stringify(value, null, 2) + '\n=============\n');
}
