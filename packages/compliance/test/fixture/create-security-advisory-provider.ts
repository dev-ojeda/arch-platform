import type { SecurityAdvisory, SecurityAdvisoryProvider } from '@arch-platform/platform-model';

export function createSecurityAdvisoryProvider(
  advisories: readonly SecurityAdvisory[],
): SecurityAdvisoryProvider {
  return {
    getAdvisories(packageName: string, version: string) {
      return Promise.resolve(
        advisories.filter((advisory) =>
          advisory.affected.some(
            (affected) =>
              affected.packageName === packageName &&
              affected.versions.some(
                (affectedVersion) =>
                  affectedVersion.status === 'affected' &&
                  affectedVersion.versionType === 'semver' &&
                  // En este fixture podemos mantenerlo simple inicialmente.
                  affectedVersion.range === version,
              ),
          ),
        ),
      );
    },
  };
}
