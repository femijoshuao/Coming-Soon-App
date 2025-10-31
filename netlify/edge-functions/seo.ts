// Netlify Edge Function to inject SEO meta tags for bots/crawlers
// It fetches dynamic SEO content from Firestore via the REST API and rewrites the HTML head

// Declare Edge runtime globals to satisfy TypeScript in the app workspace
// Netlify provides these at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const HTMLRewriter: any;

const BOT_UA_REGEX = /(bot|crawler|spider|crawling|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|embedly|quora link preview|whatsapp|discordbot|pinterest|skypeuripreview|yahoo! slurp)/i;

type SEO = { title: string; description: string; ogImage: string };

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return BOT_UA_REGEX.test(userAgent);
}

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

async function fetchSEOFromFirestore(): Promise<SEO | null> {
  const projectId = Deno.env.get('VITE_FIREBASE_PROJECT_ID') || Deno.env.get('FIREBASE_PROJECT_ID');
  const apiKey = Deno.env.get('VITE_FIREBASE_API_KEY') || Deno.env.get('FIREBASE_API_KEY');
  const siteId = Deno.env.get('VITE_SITE_ID') || Deno.env.get('SITE_ID') || 'default';
  if (!projectId || !apiKey) return null;

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/sites/${encodeURIComponent(siteId)}/settings/pageContent?key=${apiKey}`;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) return null;
  const data = await res.json();
  return parseFirestoreSEO(data);
}

function rewriteHTML(response: Response, seo: SEO): Response {
  const { title, description, ogImage } = seo;

  const rewriter = new HTMLRewriter()
    .on('title', {
      element(el) {
        if (title) el.setInnerContent(title);
      }
    })
    .on('head', {
      element(el) {
        if (description) {
          el.append(`\n<meta name="description" content="${escapeHtml(description)}">`, { html: true });
          el.append(`\n<meta property="og:description" content="${escapeHtml(description)}">`, { html: true });
          el.append(`\n<meta name="twitter:description" content="${escapeHtml(description)}">`, { html: true });
        }
        if (title) {
          el.append(`\n<meta property="og:title" content="${escapeHtml(title)}">`, { html: true });
          el.append(`\n<meta name="twitter:title" content="${escapeHtml(title)}">`, { html: true });
        }
        if (ogImage) {
          el.append(`\n<meta property="og:image" content="${escapeAttr(ogImage)}">`, { html: true });
          el.append(`\n<meta name="twitter:image" content="${escapeAttr(ogImage)}">`, { html: true });
        }
        el.append(`\n<meta property="og:type" content="website">`, { html: true });
        el.append(`\n<meta name="twitter:card" content="summary_large_image">`, { html: true });
      }
    });

  return rewriter.transform(response);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, '&quot;');
}

export default async (request: Request, context: any) => {
  const ua = request.headers.get('user-agent');
  const isCrawler = isBot(ua);

  // Always get the original response
  const response: Response = await context.next();

  // Only handle HTML responses
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  if (!isCrawler) return response;

  // Try to fetch dynamic SEO from Firestore
  let seo = await fetchSEOFromFirestore();

  // Fallback: attempt to read basic defaults from existing HTML (keep as-is if not available)
  if (!seo) return response;

  return rewriteHTML(response, seo);
};
