import { positiveNumber } from '@/lib/utils/schema.utils';
import { z } from 'zod';

export const deleteChannelSchema = z.object({
  channelId: positiveNumber,
  serverId: positiveNumber,
});

export type TDeleteChannel = z.infer<typeof deleteChannelSchema>;
