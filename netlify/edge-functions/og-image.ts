// Netlify Edge Function: Dynamic Open Graph image generator (SVG)
// Usage: /og-image?title=Hello%20World&bg=%23ff00aa&logo=https%3A%2F%2Fexample.com%2Flogo.png

function decodeParam(params: URLSearchParams, key: string, fallback = ''): string {
  const v = params.get(key);
  return v ? v : fallback;
}

export default async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const title = decodeParam(searchParams, 'title', 'Coming Soon');
  const bg = decodeParam(searchParams, 'bg', '#111827');
  const logo = decodeParam(searchParams, 'logo', '');

  const width = 1200;
  const height = 630;

  const safeTitle = title.substring(0, 120);

  // Simple SVG with background, optional logo, and centered title
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="${bg}" stop-opacity="1" />
        <stop offset="100%" stop-color="${bg}" stop-opacity="0.85" />
      </linearGradient>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    ${logo ? `<image href="${logo}" x="72" y="72" height="96" width="96" preserveAspectRatio="xMidYMid meet"/>` : ''}
    <foreignObject x="72" y="${logo ? 196 : 96}" width="1056" height="${height - (logo ? 268 : 168)}">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; color:#ffffff; font-weight:800; font-size:72px; line-height:1.1;">
        ${escapeHtml(safeTitle)}
      </div>
    </foreignObject>
    <rect x="72" y="${height - 96}" width="360" height="8" rx="4" ry="4" fill="#ffffff" opacity="0.6" filter="url(#s)"/>
  </svg>`;

  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }
  });
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
