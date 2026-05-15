// packages/testing/src/snapshots/normalize-snapshot-paths.ts

export function normalizeSnapshotPaths<T>(
    value: T
): T {

    return normalizeValue(
        value
    ) as T
}

function normalizeValue(
    value: unknown
): unknown {

    if (
        typeof value === 'string'
    ) {

        return normalizePath(
            value
        )
    }

    if (
        Array.isArray(value)
    ) {

        return value.map(
            normalizeValue
        )
    }

    if (
        value &&
        typeof value === 'object'
    ) {

        return Object.fromEntries(

            Object
                .entries(value)
                .sort(
                    ([a], [b]) =>
                        a.localeCompare(b)
                )
                .map(
                    ([key, nestedValue]) => [

                        normalizePath(key),

                        normalizeValue(
                            nestedValue
                        )
                    ]
                )
        )
    }

    return value
}

function normalizePath(
    value: string
): string {

    return value
        .replaceAll('\\', '/')
        .replace(
            /^[A-Za-z]:/,
            ''
        )
}