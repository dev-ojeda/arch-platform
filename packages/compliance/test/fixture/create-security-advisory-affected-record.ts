import type { SecurityAdvisoryAffectedRecord } from '@arch-platform/compliance';

export const securityAdvisoryAffectedRecordFixtureCVE69152: SecurityAdvisoryAffectedRecord = {
  vendor: 'juliangruber',
  product: 'brace-expansion',
  packageName: 'brace-expansion',
  versions: [
    {
      version: '< 1.1.18',
      status: 'affected',
    },
    {
      version: '>= 2.0.0, < 2.1.4',
      status: 'affected',
    },
    {
      version: '>= 3.0.0, < 3.0.6',
      status: 'affected',
    },
    {
      version: '>= 4.0.0, < 5.0.9',
      status: 'affected',
    },
  ],
};
export const securityAdvisoryAffectedRecordFixtureCVE13149: SecurityAdvisoryAffectedRecord = {
  vendor: 'juliangruber',
  product: 'brace-expansion',
  collectionURL: 'https://registry.npmjs.org',
  packageName: 'brace-expansion',
  repo: 'https://github.com/juliangruber/brace-expansion',
  versions: [
    {
      status: 'affected',
      version: '0',
      lessThanOrEqual: '5.0.6',
      versionType: 'semver',
    },
  ],
  defaultStatus: 'unaffected',
};
export const securityAdvisoryAffectedRecordFixtureCVE14257: SecurityAdvisoryAffectedRecord = {
  vendor: 'juliangruber',
  product: 'brace-expansion',
  platforms: ['Linux', 'macOS', 'Windows'],
  collectionURL: 'https://www.npmjs.com/package/brace-expansion',
  packageName: 'brace-expansion',
  versions: [
    {
      status: 'affected',
      version: '0',
      lessThanOrEqual: '5.0.7',
      versionType: 'semver',
    },
  ],
  defaultStatus: 'unaffected',
};
