// packages\contracts\src\filesystem\overwrite-policy.ts
/**
 * Defines the behavior when the target already exists.
 *
 * append: supported by write().
 */
export type OverwritePolicy = 'skip' | 'overwrite' | 'error' | 'append';
