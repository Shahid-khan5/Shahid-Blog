// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.shahidkhan.dev',
  compressHTML: true,
  integrations: [sitemap()],
  // Old Hugo URLs that people may still have.
  redirects: {
    '/about': '/cv/',
    '/about/cv': '/cv/',
    '/blog': '/posts/',
    '/archive': '/posts/',
  },
});
