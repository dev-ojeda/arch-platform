// packages/infrastructure/src/errors/template-not-found.error.ts

export class EmptyTemplateError extends Error {
  constructor(path: string) {
    super(`Template is empty: ${path}`);
  }
}
