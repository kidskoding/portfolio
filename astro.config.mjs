// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    shikiConfig: { theme: 'gruvbox-dark-hard' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
