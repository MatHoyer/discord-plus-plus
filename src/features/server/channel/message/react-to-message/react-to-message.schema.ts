import { positiveNumber } from '@/lib/utils/schema.utils';
import { z } from 'zod';

export const reactToMessageSchema = z.object({
  content: z.string(),
  messageId: positiveNumber,
  memberId: positiveNumber,
});

export type TReactToMessage = z.infer<typeof reactToMessageSchema>;
