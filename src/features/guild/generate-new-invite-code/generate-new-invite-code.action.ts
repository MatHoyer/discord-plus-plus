'use server';

import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { flattenValidationErrors } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { generateNewInviteCodeSchema } from './generate-new-invite-code.schema';

export const generateNewInviteCode = authClient
  .schema(generateNewInviteCodeSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    const server = await prisma.guild.update({
      where: {
        id: parsedInput,
        ownerId: ctx.userId,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    revalidatePath(`/channels/${server.id}`);

    return server;
  });
