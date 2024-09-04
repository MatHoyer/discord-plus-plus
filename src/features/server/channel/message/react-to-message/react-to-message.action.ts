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
  .action(async ({ parsedInput }) => {
    const { content, messageId, memberId } = parsedInput;

    const reaction = await prisma.serverMessageReaction.findFirst({
      where: {
        messageId,
        content,
      },
      include: {
        members: true,
      },
    });

    let reactionId = reaction?.id;

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

        return reactionId;
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

        if (hasAlreadyReacted) {
          await prisma.serverMessageReactionMember.deleteMany({
            where: {
              memberId,
              reactionId: reaction.id,
              messageId,
            },
          });
        } else {
          await prisma.serverMessageReactionMember.create({
            data: {
              memberId,
              messageId,
              reactionId: reaction.id,
            },
          });
        }
      }
    } else {
      const newReaction = await prisma.serverMessageReaction.create({
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
      });
      reactionId = newReaction.id;
    }

    return await prisma.serverMessageReaction.findUnique({
      where: {
        id: reactionId,
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
  });
