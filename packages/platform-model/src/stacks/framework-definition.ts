import type { FrameworkCategory } from './framework-category.js';
import type { CapabilityId, FrameworkId, LanguageId } from '../shared/identifier.js';
import type { Metadata } from '../shared/metadata.js';


export interface FrameworkDefinition extends Metadata {
  id: FrameworkId;

  category?: FrameworkCategory;

  language: LanguageId;

  supportedCapabilities?: CapabilityId[];
}
