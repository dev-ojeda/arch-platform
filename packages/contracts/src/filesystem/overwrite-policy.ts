// packages\contracts\src\filesystem\overwrite-policy.ts
/**
 * Defines the behavior when the target already exists.
 *
 * append: supported by write().
 * merge: supported by writeJson().
 */
export type OverwritePolicy = 'skip' | 'overwrite' | 'error' | 'append' | 'merge';
