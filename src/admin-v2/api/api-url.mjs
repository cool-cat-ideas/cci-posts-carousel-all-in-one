/** Resolve REST paths against WordPress' configured root, including plain permalinks. */
export function resolveApiUrl(path, restRoot) {
  if (!restRoot || !path.startsWith('/wp-json/')) {
    return path;
  }

  const route = new URL(path.slice('/wp-json'.length), 'https://wordpress.invalid');
  const root = new URL(restRoot);

  if (root.searchParams.has('rest_route')) {
    root.searchParams.set('rest_route', route.pathname);
  } else {
    root.pathname = `${root.pathname.replace(/\/$/, '')}${route.pathname}`;
  }

  for (const [key, value] of route.searchParams) {
    root.searchParams.append(key, value);
  }
  root.hash = route.hash;
  return root.toString();
}
