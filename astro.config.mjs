// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import catppuccinMacchiato from '@shikijs/themes/catppuccin-macchiato';
import { satteri } from '@astrojs/markdown-satteri';
import { mermaidPlugin } from './src/lib/mermaid.mjs';

// Upstream maps markup.deleted to orange; use Catppuccin red like git gutters.
// Upstream also italicizes comments, keywords and parameters; code blocks stay upright.
const catppuccinMacchiatoDiff = {
  ...catppuccinMacchiato,
  tokenColors: catppuccinMacchiato.tokenColors?.map((rule) => {
    const settings = { ...rule.settings };
    if (rule.scope === 'markup.deleted') settings.foreground = '#ed8796';
    if (settings.fontStyle?.includes('italic')) settings.fontStyle = settings.fontStyle.replace('italic', '').trim();
    return { ...rule, settings };
  }),
};

// https://astro.build/config
export default defineConfig({
  site: 'https://anirudh-konidala.vercel.app',
  integrations: [mdx()],
  markdown: {
    processor: satteri({ mdastPlugins: [mermaidPlugin] }),
    shikiConfig: { theme: catppuccinMacchiatoDiff },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
