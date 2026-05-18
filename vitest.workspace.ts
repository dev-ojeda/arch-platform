// vitest.workspace.ts
import { defineWorkspace } from "vitest/config";

export default defineWorkspace(["packages/*", "generators/*", "plugins/*"]);
