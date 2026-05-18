// packages/application/src/generation/engine/default-generation-runtime.ts

import type { GenerationRequest } from "@arch/contracts";
import type { GenerationEngine } from "./generation-engine.js";

export class GeneratorRuntime {
  constructor(private readonly engine: GenerationEngine) {}

  generate(request: GenerationRequest) {
    return this.engine.generate(request);
  }
}
