/**
 * src/content.config.ts — Astro v5+ Content Layer API
 * (replaces legacy src/content/config.ts)
 *
 * Blog collection using the glob() loader to pick up all markdown files
 * in src/content/blog/. Schema matches spec §21 requirements.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Ujjwal Lage'),
    featuredImage: z.string().optional(),
    featuredImageAlt: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    relatedArticles: z.array(z.string()).default([]),
    relatedServices: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
