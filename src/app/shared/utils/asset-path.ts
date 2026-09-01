export function toAbsoluteAssetPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}
