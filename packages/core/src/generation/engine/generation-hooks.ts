// packages/core/src/engine/generation-hooks.ts

import type { FileDefinition, FileHookContext, NamedVariables } from '@arch/contracts';

export async function runBeforeWriteHook<TVariables extends NamedVariables>(
  file: FileDefinition<TVariables>,

  ctx: FileHookContext<TVariables>,
): Promise<void> {
  if (!file.beforeWrite) {
    return;
  }

  await file.beforeWrite(ctx);
}

export async function runAfterWriteHook<TVariables extends NamedVariables>(
  file: FileDefinition<TVariables>,

  ctx: FileHookContext<TVariables>,
): Promise<void> {
  if (!file.afterWrite) {
    return;
  }

  await file.afterWrite(ctx);
}
