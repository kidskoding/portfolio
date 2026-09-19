import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().optional().default(false),
    coverImage: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects',
    generateId: ({ entry }) =>
      entry.replace(/\.(?:md|mdx)$/i, '').replace(/\/index$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.enum(['project', 'hackathon', 'agentic']),
      repo: z.string().url(),
      language: z.string().optional(),
      stack: z.array(z.string()).default([]),
      date: z.coerce.date(),
      cover: image().optional(),
      event: z.string().optional(),
      placement: z.string().optional(),
      order: z.number().optional(),
      draft: z.boolean().optional().default(false),
    }),
});

export const collections = { blog, projects };
