// packages/platform-model/src/types/maybe-promise.ts

/**
 * Represents a value that may be resolved synchronously
 * or asynchronously.
 *
 * Use this contract when implementations are allowed to return
 * immediate values or Promises.
 *
 * Example:
 *
 * interface Rule {
 *   execute(): MaybePromise<Result>;
 * }
 *
 * This allows simple implementations:
 *
 * execute() {
 *   return [];
 * }
 *
 * and asynchronous implementations:
 *
 * async execute() {
 *   return await analyze();
 * }
 */
export type MaybePromise<T> = T | Promise<T>;
