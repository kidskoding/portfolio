// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import tokyonightMoon from './src/styles/shiki-tokyonight-moon.json';

// https://astro.build/config
export default defineConfig({
  site: 'https://anirudh-konidala.vercel.app',
  integrations: [mdx()],
  markdown: {
    shikiConfig: { theme: { ...tokyonightMoon, type: 'dark', bg: '#1e2030' } },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
