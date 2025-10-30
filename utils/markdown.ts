/**
 * Simple markdown parser for basic formatting
 * Supports: bold, italic, links, line breaks
 */

export const parseMarkdown = (text: string): string => {
  if (!text) return '';

  let html = text;

  // Escape HTML to prevent XSS
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold: **text** or __text__
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Links: [text](url)
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline hover:opacity-80">$1</a>');

  // Line breaks: double newline = paragraph, single newline = <br>
  html = html.replace(/\n\n/g, '</p><p class="mt-4">');
  html = html.replace(/\n/g, '<br />');

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<p')) {
    html = '<p>' + html + '</p>';
  }

  // Strikethrough: ~~text~~
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Code: `code`
  html = html.replace(/`(.+?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>');

  return html;
};

/**
 * Strip markdown formatting to get plain text
 */
export const stripMarkdown = (text: string): string => {
  if (!text) return '';

  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`(.+?)`/g, '$1');
};
