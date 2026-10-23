// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import gruvboxDarkMedium from '@shikijs/themes/gruvbox-dark-medium';

// Upstream maps markup.deleted to orange (#d65d0e); use gruvbox bright red like git gutters.
const gruvboxDarkMediumDiff = {
  ...gruvboxDarkMedium,
  tokenColors: gruvboxDarkMedium.tokenColors?.map((rule) =>
    rule.scope === 'markup.deleted' ? { ...rule, settings: { ...rule.settings, foreground: '#fb4934' } } : rule,
  ),
};

// https://astro.build/config
export default defineConfig({
  site: 'https://anirudh-konidala.vercel.app',
  integrations: [mdx()],
  markdown: {
    shikiConfig: { theme: gruvboxDarkMediumDiff },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
