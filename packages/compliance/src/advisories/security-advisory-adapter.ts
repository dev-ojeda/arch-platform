// packages/compliance/src/advisories/security-advisory-adapter.ts

import type { SecurityAdvisoryAffectedPort } from '../ports/security-advisory-affected-port.js';

import type { SecurityAdvisoryAffectedRecord } from './security-advisory-affected-record.js';
import type { SecurityAdvisoryAffectedVersion } from './security-advisory-affected-versions.js';
import type { SecurityAdvisoryAffected } from './security-advisory-affected.js';

export class SecurityAdvisoryAffectedAdapter implements SecurityAdvisoryAffectedPort {
  advisoryAffected(affected: SecurityAdvisoryAffectedRecord): SecurityAdvisoryAffected {
    const packageName = affected.packageName ?? affected.product;

    if (!packageName) {
      throw new Error('CVE affected record must define packageName or product');
    }

    return {
      packageName,
      vendor: affected.vendor,
      product: affected.product,
      platforms: affected.platforms,
      collectionURL: affected.collectionURL,
      repo: affected.repo,
      defaultStatus: affected.defaultStatus,
      versions: this.advisoryAffectedVersions(affected),
    };
  }

  private advisoryAffectedVersions(
    affected: SecurityAdvisoryAffectedRecord,
  ): SecurityAdvisoryAffectedVersion[] {
    return affected.versions.map((version) => ({
      status: version.status,
      range:
        version.lessThanOrEqual !== undefined
          ? `<=${version.lessThanOrEqual}`
          : this.normalizeRange(version.version),
      versionType: version.versionType ?? 'semver',
    }));
  }

  private normalizeRange(range: string): string {
    return range.replaceAll(',', ' ').replace(/\s+/g, ' ').trim();
  }
}
