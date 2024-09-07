import { positiveNumber } from '@/lib/utils/schema.utils';
import { z } from 'zod';
import { deleteMessageSchema } from '../delete-message/delete-message.schema';

export const deleteAttachmentSchema = deleteMessageSchema.extend({
  attachmentId: positiveNumber,
});

export type TDeleteAttachmentSchema = z.infer<typeof deleteAttachmentSchema>;
