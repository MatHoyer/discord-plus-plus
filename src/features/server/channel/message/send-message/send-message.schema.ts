import { positiveNumber } from '@/lib/utils/schema.utils';
import { z } from 'zod';

export const MAX_MESSAGE_LENGTH = 2000;

export const messageSchema = z.string().min(1).max(MAX_MESSAGE_LENGTH, {
  message:
    'You need to shorten your current message to less than 2000 characters.',
});

export const sendMessageSchema = z.object({
  content: messageSchema,
  channelId: positiveNumber,
  memberId: positiveNumber,
  replyingToMessageId: positiveNumber.optional(),
});

export type TSendMessage = z.infer<typeof sendMessageSchema>;
