import { positiveNumber } from '@/lib/schema-utils';
import { Channeltype } from '@prisma/client';
import { z } from 'zod';

export const createChannelSchema = z.object({
  type: z.nativeEnum(Channeltype),
  name: z
    .string()
    .min(3, { message: 'Channel name must be at least 3 characters long' })
    .max(30, {
      message: 'Channel name must be at most 30 characters long',
    })
    .refine((name) => name !== 'general', {
      message: "Name cannot be 'general'",
    }),
  serverId: positiveNumber,
});

export type TCreateChannel = z.infer<typeof createChannelSchema>;
