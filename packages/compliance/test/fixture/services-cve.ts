export interface CVERecordResponse {
  dataType: 'CVE';
  dataVersion: '5.0' | '5.2';
  cveMetadata: {
    cveId: string;
    assignerOrgId: string;
    assignerShortName?: string;
    state: 'PUBLISHED' | 'REJECTED';
    datePublished?: string;
    dateUpdated?: string;
  };
  containers: {
    cna: {
      providerMetadata: {
        orgId: string;
        shortName?: string;
        dateUpdated?: string;
      };
      descriptions: Array<{
        lang: string;
        value: string;
      }>;
      affected: Array<{
        vendor: string;
        product: string;
        versions: Array<{
          version: string;
          status: 'affected' | 'unaffected' | 'unknown';
        }>;
      }>;
      references?: Array<{
        url: string;
        name?: string;
        tags?: string[];
      }>;
    };
  };
}

export class CveClient {
  private baseUrl = 'https://mitre.org/CVE-2026-69152';

  /**
   * Fetches data for a specific CVE ID.
   * @param cveId Example: 'CVE-2023-45727'
   */
  async getCveRecord(cveId: string): Promise<CVERecordResponse> {
    const url = `${this.baseUrl}/${cveId}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`CVE API Error: ${response.status} ${response.statusText}`);
      }

      const data: CVERecordResponse = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to retrieve ${cveId}:`, error);
      throw error;
    }
  }
}

// Example usage:
(async () => {
  const client = new CveClient();
  const cveData = await client.getCveRecord('CVE-2026-69152');

  console.log(`State: ${cveData.cveMetadata.state}`);
  console.log(`Description: ${cveData.containers.cna.descriptions[0]?.value}`);
})();
