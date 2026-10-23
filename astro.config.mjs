// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import gruvboxDarkHard from '@shikijs/themes/gruvbox-dark-hard';

// Upstream maps markup.deleted to orange (#d65d0e); use gruvbox bright red like git gutters.
const gruvboxDarkHardDiff = structuredClone(gruvboxDarkHard);
for (const rule of gruvboxDarkHardDiff.tokenColors ?? []) {
  if (rule.scope === 'markup.deleted') {
    rule.settings = { ...rule.settings, foreground: '#fb4934' };
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://anirudh-konidala.vercel.app',
  integrations: [mdx()],
  markdown: {
    shikiConfig: { theme: gruvboxDarkHardDiff },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
