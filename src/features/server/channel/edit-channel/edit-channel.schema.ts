import { positiveNumber } from '@/lib/schema-utils';
import { z } from 'zod';

export const editChannelSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Channel name must be at least 3 characters long' })
    .max(30, {
      message: 'Channel name must be at most 30 characters long',
    })
    .refine((name) => name !== 'general', {
      message: "Name cannot be 'general'",
    }),
  channelId: positiveNumber,
});

export type TEditChannel = z.infer<typeof editChannelSchema>;
