import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://astro-cube.vercel.app/',
  integrations: [sitemap()],
  experimental: {
    svg: true,
  },
  printWidth: 100,
  singleQuote: true,
});
