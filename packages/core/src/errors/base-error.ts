// packages\core\src\errors\base-error.ts
export abstract class BaseError<
  TMetadata = unknown
>
extends Error {

    readonly metadata?: TMetadata
}