// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Replace with final production domain before launch
  site: 'https://ujjwalseo.fr',

  output: 'static',

  integrations: [
    sitemap({
      // Exclude pages marked noIndex — they carry noindex meta tags and
      // should not appear in the sitemap (contradictory signals to Google).
      filter: (page) =>
        !page.includes('/mentions-legales/') &&
        !page.includes('/politique-confidentialite/'),
    }),
  ],
});
