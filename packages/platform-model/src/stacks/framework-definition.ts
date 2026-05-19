import type {
  CapabilityId,
  FrameworkId,
  LanguageId,
} from "../shared/identifier.js";
import type { Metadata } from "../shared/metadata.js";
import type { FrameworkCategory } from "./framework-category.js";

export interface FrameworkDefinition extends Metadata {
  id: FrameworkId;

  category?: FrameworkCategory;

  language: LanguageId;

  supportedCapabilities?: CapabilityId[];
}
