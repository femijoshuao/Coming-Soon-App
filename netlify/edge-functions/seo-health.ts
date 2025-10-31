// Netlify Edge Function: SEO health endpoint
// Returns the SEO JSON that would be used for the current path

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;

type SEO = { title: string; description: string; ogImage: string };

function parseFirestoreSEO(doc: any): SEO | null {
  try {
    const fields = doc?.fields || {};
    const seo = fields.seo?.mapValue?.fields || {};
    const title = seo.title?.stringValue || '';
    const description = seo.description?.stringValue || '';
    const ogImage = seo.ogImage?.stringValue || '';
    if (!title && !description && !ogImage) return null;
    return { title, description, ogImage };
  } catch {
    return null;
  }
}

function pathKeyFromUrl(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    let p = u.pathname;
    if (p.endsWith('/')) p = p.slice(0, -1);
    if (p.startsWith('/')) p = p.slice(1);
    return p || 'index';
  } catch {
    return 'index';
  }
}

export default async (request: Request) => {
  const projectId = Deno.env.get('VITE_FIREBASE_PROJECT_ID') || Deno.env.get('FIREBASE_PROJECT_ID');
  const apiKey = Deno.env.get('VITE_FIREBASE_API_KEY') || Deno.env.get('FIREBASE_API_KEY');
  const siteId = Deno.env.get('VITE_SITE_ID') || Deno.env.get('SITE_ID') || 'default';

  const origin = new URL(request.url).origin;
  const pathKey = pathKeyFromUrl(request.url);

  const result: any = { origin, pathKey, projectId: !!projectId, apiKey: !!apiKey, siteId };

  if (!projectId || !apiKey) {
    return new Response(JSON.stringify({ error: 'Missing FIREBASE env vars', ...result }, null, 2), {
      headers: { 'content-type': 'application/json; charset=utf-8' },
      status: 500
    });
  }

  // Fetch global SEO
  const globalUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/sites/${encodeURIComponent(siteId)}/settings/pageContent?key=${apiKey}`;
  const globalRes = await fetch(globalUrl, { headers: { accept: 'application/json' } });
  const globalJson = globalRes.ok ? await globalRes.json() : null;
  const globalSEO = globalJson ? parseFirestoreSEO(globalJson) : null;

  // Fetch route SEO
  const routeDocId = encodeURIComponent(pathKey.toLowerCase());
  const routeUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/sites/${encodeURIComponent(siteId)}/seo/${routeDocId}?key=${apiKey}`;
  const routeRes = await fetch(routeUrl, { headers: { accept: 'application/json' } });
  const routeJson = routeRes.ok ? await routeRes.json() : null;
  const routeSEO = routeJson ? parseFirestoreSEO(routeJson) : null;

  const chosen = routeSEO || globalSEO;
  const payload = {
    ok: true,
    origin,
    pathKey,
    global: globalSEO,
    route: routeSEO,
    selected: chosen,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
