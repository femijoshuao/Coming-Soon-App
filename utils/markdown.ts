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

  // Process lists before line breaks to avoid conflicts
  // Unordered lists: - item or * item
  html = html.replace(/^[\s]*[-*]\s+(.+)$/gm, '<li class="mb-1">$1</li>');
  
  // Ordered lists: 1. item
  html = html.replace(/^[\s]*\d+\.\s+(.+)$/gm, '<li class="mb-1">$1</li>');
  
  // Wrap consecutive list items in ul or ol tags
  html = html.replace(/(<li[^>]*>.*?<\/li>)(\s*<li[^>]*>.*?<\/li>)*/gs, (match) => {
    // Check if this looks like it should be an ordered list (contains numbered items in original)
    const originalLines = text.split('\n');
    const hasOrderedList = originalLines.some(line => /^\s*\d+\.\s+/.test(line));
    
    if (hasOrderedList && match.includes('1.')) {
      return `<ol class="list-decimal list-inside space-y-1 my-4">${match}</ol>`;
    } else {
      return `<ul class="list-disc list-inside space-y-1 my-4">${match}</ul>`;
    }
  });

  // Line breaks: double newline = paragraph, single newline = <br>
  html = html.replace(/\n\n/g, '</p><p class="mt-4">');
  html = html.replace(/\n/g, '<br />');

  // Wrap in paragraph if not already wrapped and doesn't start with list
  if (!html.startsWith('<p') && !html.startsWith('<ul') && !html.startsWith('<ol')) {
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
