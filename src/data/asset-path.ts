export function assetPath(path: string): string {
  return path.startsWith("/") && !path.startsWith("//")
    ? (process.env.NEXT_PUBLIC_SHOWROOM_BASE_PATH ?? "") + path
    : path;
}
