// packages/compliance/src/advisories/advisory-identifier.ts

export class AdvisoryIdentifier {
  readonly namespace: string;
  readonly value: string;

  constructor(namespace: string, value: string) {
    const normalizedNamespace = namespace.trim();
    const normalizedValue = value.trim();

    if (!normalizedNamespace) {
      throw new Error('Advisory identifier namespace cannot be empty');
    }

    if (!normalizedValue) {
      throw new Error('Advisory identifier value cannot be empty');
    }

    this.namespace = normalizedNamespace;
    this.value = normalizedValue;
  }

  equals(other: AdvisoryIdentifier): boolean {
    return this.namespace === other.namespace && this.value === other.value;
  }
}
