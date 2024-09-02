import { z } from 'zod';

export const sendMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  channelId: z.number(),
  senderId: z.number(),
});

export type TSendMessage = z.infer<typeof sendMessageSchema>;
