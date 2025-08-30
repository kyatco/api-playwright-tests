export function resolveEndpoint(rawEndpoint: string, baseUrl?: string): string {
    const clean = rawEndpoint.replace(/['"]+/g, '').trim();
    if (clean.startsWith('http')) {
      return clean; // already full URL
    }
    if (!baseUrl) {
      throw new Error(`No BASE_URL provided and endpoint is relative: ${clean}`);
    }
    return `${baseUrl.replace(/\/$/, '')}/${clean.replace(/^\//, '')}`;
  }