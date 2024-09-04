'use server';

import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { flattenValidationErrors } from 'next-safe-action';
import { reactToMessageSchema } from './react-to-message.schema';

export const reactToMessage = authClient
  .schema(reactToMessageSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    const { content, messageId, memberId } = parsedInput;

    let reaction = await prisma.serverMessageReaction.findFirst({
      where: {
        messageId,
        content,
      },
      include: {
        members: true,
      },
    });

    if (reaction) {
      const hasAlreadyReacted = reaction.members.some(
        (m) => m.memberId === memberId
      );
      if (hasAlreadyReacted && reaction.number === 1) {
        await prisma.serverMessageReaction.delete({
          where: {
            id: reaction.id,
          },
        });
      } else {
        await prisma.serverMessageReaction.update({
          where: {
            id: reaction.id,
          },
          data: {
            number: {
              [hasAlreadyReacted ? 'decrement' : 'increment']: 1,
            },
          },
        });
      }
    } else {
      reaction = await prisma.serverMessageReaction.create({
        data: {
          number: 1,
          content,
          messageId,
          members: {
            create: {
              memberId,
              messageId,
            },
          },
        },
        include: {
          members: {
            include: {
              member: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
    }

    return reaction;
  });
