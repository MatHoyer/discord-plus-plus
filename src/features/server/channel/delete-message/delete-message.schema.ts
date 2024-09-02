import { positiveNumber } from '@/lib/schema-utils';
import { z } from 'zod';

export const deleteMessageSchema = z.object({
  messageId: positiveNumber,
  serverId: positiveNumber,
  channelId: positiveNumber,
});
