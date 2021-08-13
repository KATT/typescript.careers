import { z } from 'zod';

export const imageField = z.object({
  id: z.string().nullish(),
  base64: z.string().nullish(),
});

export const jobFormSchema = z.object({
  title: z.string().min(5).max(40),
  text: z.string().min(50),
  company: z.object({
    id: z.string().nullish(),
    name: z.string().min(1).max(40),
    url: z.string().url(),
    image: imageField,
  }),
  applyUrl: z.string().url(),
  tags: z.array(z.string()),
});

export function JobForm() {}
