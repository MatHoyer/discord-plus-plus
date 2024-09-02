import { positiveNumber } from '@/lib/schema-utils';
import { z } from 'zod';

export const editMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  messageId: positiveNumber,
  serverId: positiveNumber,
  channelId: positiveNumber,
});

export type TEditMessage = z.infer<typeof editMessageSchema>;
