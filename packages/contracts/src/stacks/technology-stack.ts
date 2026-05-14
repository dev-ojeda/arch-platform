// packages\contracts\src\stacks\technology-stack.ts
export interface TechnologyStack {
  id: string

  languageId: string

  frameworkId?: string

  runtimeId?: string

  tags?: readonly string[]
}