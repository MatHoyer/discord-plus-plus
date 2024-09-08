import { z } from 'zod';

export const createGuildSchema = z.object({
  name: z.string().min(3).max(255),
  imageUrl: z.string().url().optional(),
});

export type TCreateGuild = z.infer<typeof createGuildSchema>;
