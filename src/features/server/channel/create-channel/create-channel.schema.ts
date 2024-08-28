import { z } from 'zod';

export const createChannelSchema = z.object({
  type: z.enum(['TEXT', 'AUDIO']),
  name: z.string().min(3).max(255),
  serverId: z.number(),
});

export type TCreateChannel = z.infer<typeof createChannelSchema>;
