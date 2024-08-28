'use server';
import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { wait } from '@/lib/utils';
import { flattenValidationErrors } from 'next-safe-action';
import { createChannelSchema } from './create-channel.schema';

export const createChannel = authClient
  .schema(createChannelSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    await wait(2000);
    console.log(parsedInput);
    const channel = await prisma.channel.create({
      data: {
        ...parsedInput,
      },
    });

    return channel;
  });
