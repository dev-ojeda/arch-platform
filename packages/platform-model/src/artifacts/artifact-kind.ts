// packages/platform-model/src/artifacts/artifact-kind.ts

export type ArtifactKind =
  | "controller"
  | "service"
  | "repository"
  | "entity"
  | "dto"
  | "module"
  | "provider"
  | "handler"
  | "schema"
  | "migration"
  | "event"
  | "command"
  | "query";
