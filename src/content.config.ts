import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Standalone pages such as /cv/ and /cpp-ide/.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

const file = z.object({
  url: z.url(),
  title: z.string(),
  type: z.string().optional(),
  description: z.string().optional(),
  size: z.string().optional(),
});

const subjects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/subjects' }),
  schema: z.object({
    title: z.string(),
    professor: z.string(),
    subject_code: z.string(),
    description: z.string(),
    courseOutline: z.array(file).default([]),
  }),
});

// Hugo let these lists be empty or null, so accept both.
const list = <T extends z.ZodType>(item: T) =>
  z.array(item).nullish().transform((v) => v ?? []);

const classes = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/classes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    classTime: z.string().optional(),
    location: z.string().optional(),
    professor: z.string().optional(),
    topics: list(z.string()),
    videos: list(z.object({ url: z.string(), title: z.string(), duration: z.string().optional() })),
    audio: list(z.object({ url: z.string(), title: z.string() })),
    images: list(z.object({ url: z.string(), caption: z.string().optional() })),
    documents: list(file),
  }),
});

export const collections = { posts, pages, subjects, classes };
