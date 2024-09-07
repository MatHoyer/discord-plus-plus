import { positiveNumber } from '@/lib/utils/schema.utils';
import { z } from 'zod';

export const deleteMessageSchema = z.object({
  messageId: positiveNumber,
  serverId: positiveNumber,
  channelId: positiveNumber,
});

export type TDeleteMessageSchema = z.infer<typeof deleteMessageSchema>;
