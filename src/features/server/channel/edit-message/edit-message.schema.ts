import { z } from 'zod';
import { deleteMessageSchema } from '../delete-message/delete-message.schema';
import { messageSchema } from '../send-message/send-message.schema';

export const editMessageSchema = deleteMessageSchema.extend({
  content: messageSchema,
});

export type TEditMessage = z.infer<typeof editMessageSchema>;
