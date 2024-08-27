import { z } from 'zod';

export const createServerSchema = z.object({
  name: z.string().min(3).max(255),
  imageUrl: z.string().url(),
});

export type TCreateServer = z.infer<typeof createServerSchema>;
