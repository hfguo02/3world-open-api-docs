export type ApiRelease = '1.0.0' | '1.1.0';

const API_BASE_PATHS: Record<ApiRelease, string> = {
  '1.1.0': '/api',
  '1.0.0': '/v1/api',
};

export function apiBasePath(version: ApiRelease) {
  return API_BASE_PATHS[version];
}

export function operationSlug(operationId: string) {
  return operationId
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Za-z])(\d)/g, '$1-$2')
    .toLowerCase();
}
