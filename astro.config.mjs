// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Replace with final production domain before launch
  site: 'https://ujjwalseo.fr',

  output: 'static',

  integrations: [
    sitemap(),
  ],
});
