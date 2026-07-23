// Proxies ArcGIS Online hosted tile requests through our own domain.
//
// Two problems this solves that a static _redirects proxy cannot:
//   1. Ad/tracker blockers and privacy browsers (Zen, Firefox strict, uBlock)
//      block requests to arcgis.com outright. Routing through our origin hides
//      the upstream host, so the tiles load everywhere.
//   2. ArcGIS serves the PNG tile bytes mislabeled as `application/octet-stream`
//      with `x-content-type-options: nosniff`. Chrome decodes anyway
//      (createImageBitmap ignores the type), but Firefox/Zen honor nosniff and
//      refuse to render a non-image MIME — leaving a blank raster. Netlify does
//      NOT apply custom header rules to proxied responses, so the only place we
//      can relabel the bytes is here, in code.
export default async (request) => {
  const url = new URL(request.url);
  const upstream = `https://tiles.arcgis.com${url.pathname.replace(/^\/map-tiles/, '')}${url.search}`;

  const res = await fetch(upstream);

  // Only relabel the mislabeled PNG tiles (served as application/octet-stream).
  // Tiles outside the data extent legitimately 404 (mapbox skips them), and
  // metadata requests like ?f=json come back as application/json — both must
  // pass through untouched.
  const type = res.headers.get('content-type') || '';
  if (!res.ok || !type.includes('octet-stream')) return res;

  const headers = new Headers(res.headers);
  headers.set('content-type', 'image/png');
  headers.delete('x-content-type-options'); // drop nosniff so Firefox/Zen decode it

  return new Response(res.body, { status: res.status, headers });
};

// Path deliberately avoids the substring "arcgis": blocker filter lists match on
// URL substrings, so /arcgis-tiles/* would be blocked even on our own domain.
export const config = { path: '/map-tiles/*' };
