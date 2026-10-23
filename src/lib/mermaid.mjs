import { renderMermaidSVG } from 'beautiful-mermaid';

// Gruvbox tokens from global.css, passed as CSS variables so the diagram tracks the palette.
const colors = {
  bg: 'var(--color-nvim-bg-hard)',
  fg: 'var(--color-nvim-fg)',
  line: 'var(--color-nvim-gray)',
  accent: 'var(--color-nvim-orange)',
  muted: 'var(--color-nvim-fg2)',
  surface: 'var(--color-nvim-bg1)',
  border: 'var(--color-nvim-bg3)',
};

// Sätteri mdast plugin: renders ```mermaid fences to inline SVG at build time, before Shiki sees them.
export const mermaidPlugin = {
  name: 'mermaid',
  code(node, ctx) {
    if (node.lang !== 'mermaid') return;

    const svg = renderMermaidSVG(node.value, { ...colors, font: 'JetBrains Mono', transparent: true, padding: 16 })
      // Drop the embedded <style> (a Google Fonts import plus derived color variables): smart punctuation
      // would mangle its `--` and quotes, and its bare `svg {}` rule would leak onto every SVG on the page.
      // global.css defines the same variables under .mermaid-diagram.
      .replace(/<style>[\s\S]*?<\/style>/, '')
      // One line: a blank or indented line would end the raw HTML block and turn the rest into Markdown.
      .replace(/\s*\n\s*/g, ' ');

    ctx.replaceNode(node, { rawHtml: `<figure class="mermaid-diagram">${svg}</figure>` });
  },
};
