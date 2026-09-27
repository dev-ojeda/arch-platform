import type { SecurityAdvisory } from '@arch-platform/platform-model';

export const securityAdvisoryFixtureCVE13149: SecurityAdvisory = {
  identifiers: [
    {
      namespace: 'CVE',
      value: 'CVE-2026-13149',
    },
  ],
  cweIds: ['CWE-400', 'CWE-407'],
  assessments: [
    {
      version: '4.0',
      baseScore: 7.7,
      baseSeverity: 'HIGH',
      vectorString: 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:N/VA:H/SC:N/SI:N/SA:N',
    },
  ],
  affected: [
    {
      vendor: 'juliangruber',
      product: 'brace-expansion',
      packageName: 'brace-expansion',
      collectionURL: 'https://registry.npmjs.org',
      repo: 'https://github.com/juliangruber/brace-expansion',
      defaultStatus: 'unaffected',
      versions: [
        {
          status: 'affected',
          range: '<=5.0.6',
          lessThanOrEqual: '5.0.6',
          versionType: 'semver',
        },
      ],
    },
  ],
};

export const securityAdvisoryFixtureCVE14257: SecurityAdvisory = {
  identifiers: [
    {
      namespace: 'CVE',
      value: 'CVE-2026-14257',
    },
  ],
  cweIds: ['CWE-400', 'CWE-770'],
  assessments: [
    {
      version: '3.1',
      baseScore: 7.5,
      baseSeverity: 'HIGH',
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H',
    },
  ],
  affected: [
    {
      vendor: 'juliangruber',
      product: 'brace-expansion',
      packageName: 'brace-expansion',
      platforms: ['Linux', 'macOS', 'Windows'],
      collectionURL: 'https://www.npmjs.com/package/brace-expansion',
      defaultStatus: 'unaffected',
      versions: [
        {
          status: 'affected',
          range: '<=5.0.7',
          lessThanOrEqual: '5.0.7',
          versionType: 'semver',
        },
      ],
    },
  ],
};

export const securityAdvisoryFixtureCVE69152: SecurityAdvisory = {
  identifiers: [
    {
      namespace: 'CVE',
      value: 'CVE-2026-69152',
    },
    {
      namespace: 'GHSA',
      value: 'rgw5-rvv9-x895',
    },
  ],
  cweIds: ['CWE-400', 'CWE-770'],
  assessments: [
    {
      version: '3.1',
      baseScore: 7.5,
      baseSeverity: 'HIGH',
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H',
    },
  ],
  affected: [
    {
      vendor: 'juliangruber',
      product: 'brace-expansion',
      packageName: 'brace-expansion',
      versions: [
        {
          status: 'affected',
          range: '<1.1.18',
          versionType: 'semver',
        },
        {
          status: 'affected',
          range: '>=2.0.0 <2.1.4',
          versionType: 'semver',
        },
        {
          status: 'affected',
          range: '>=3.0.0 <3.0.6',
          versionType: 'semver',
        },
        {
          status: 'affected',
          range: '>=4.0.0 <5.0.9',
          versionType: 'semver',
        },
      ],
    },
  ],
};

export const securityAdvisoryFixtures: readonly SecurityAdvisory[] = [
  securityAdvisoryFixtureCVE13149,
  securityAdvisoryFixtureCVE14257,
  securityAdvisoryFixtureCVE69152,
];
