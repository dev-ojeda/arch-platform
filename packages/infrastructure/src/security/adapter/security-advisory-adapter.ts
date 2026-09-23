// packages/infrastructure/src/security/adapter/security-advisory-adapter.ts

import type {
  SecurityAdvisoryAffected,
  SecurityAdvisoryAffectedPort,
  SecurityAdvisoryAffectedRecord,
  SecurityAdvisoryAffectedVersion,
} from '@arch-platform/platform-model';

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
