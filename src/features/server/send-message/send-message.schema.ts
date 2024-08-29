import { z } from 'zod';

export const SendMessageSchema = z.object({
  message: z.string(),
  channelId: z.number(),
  senderId: z.number(),
});

export type TSendMessage = z.infer<typeof SendMessageSchema>;
