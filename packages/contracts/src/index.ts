// packages\contracts\src\index.ts

export type { GenerationDiagnostic } from './diagnostics/index.js';
export type {
  GenerationEvent,
  GenerationEventBus,
  GenerationEventHandler,
  GenerationEventName,
} from './events/index.js';
export type { GenerationReportExporter } from './exporters/index.js';
export type {
  DirectoryEntry,
  FileSystemAsyncPort,
  FileSystemSyncPort,
  OverwritePolicy,
  PathService,
  WriteFileOptions,
} from './filesystem/index.js';
export type {
  FileHookContext,
  GeneratedFile,
  GenerationContext,
  GenerationPipelineStep,
  GenerationRequest,
  GenerationResult,
} from './generation/index.js';
export type {
  GeneratorCapabilities,
  GeneratorDefinition,
  GeneratorDescriptor,
  GeneratorModule,
  GeneratorRegistry,
  GeneratorRuntime,
  RegisteredGeneratorDefinition,
} from './generators/index.js';
export type {
  ConfigHashService,
  DirectoryHashService,
  FileHashService,
  HashService,
  HashValue,
} from './hashing/index.js';

export type { GenerationHooks } from './hooks/index.js';
export type { FolderLayout, LanguageConvention } from './languages/index.js';
export type {
  LoggerLevel,
  LoggerMetadata,
  LoggerOptions,
  LoggerPort,
  LoggerSource,
} from './logging/index.js';
export type { ResolvedFileDefinition, ResolvedTemplate } from './pipeline/index.js';
export type {
  BooleanField,
  PromptAdapter,
  PromptField,
  PromptResolver,
  PromptSchema,
  PromptValues,
  SelectField,
  SelectOption,
  StringField,
} from './prompts/index.js';
export type { RenderedFile, RenderTemplateInput, TemplateRendererPort } from './renderer/index.js';
export type { GenerationReport } from './reports/index.js';
export type {
  GenerationCancellationReason,
  GenerationTimeoutPolicy,
  IdGenerator,
  RuntimeHooks,
  RuntimeMetadata,
} from './runtime/index.js';
export type { TechnologyStack } from './stacks/index.js';
export type { StepExecutionMetric } from './telemetry/index.js';
export type { FileDefinition, ResolvedTemplateVariables } from './templates/index.js';
export type { NamedVariables, TemplateVariables, VariableValue } from './variables/index.js';
export type { WorkspaceProvider } from './workspace/index.js';
// test 7
