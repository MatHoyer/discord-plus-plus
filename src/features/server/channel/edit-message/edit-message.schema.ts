import { z } from 'zod';
import { deleteMessageSchema } from '../delete-message/delete-message.schema';

export const editMessageSchema = deleteMessageSchema.extend({
  content: z.string().min(1).max(2000),
});

export type TEditMessage = z.infer<typeof editMessageSchema>;
