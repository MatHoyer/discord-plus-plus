import { z } from 'zod';

export const generateNewInviteCodeSchema = z.number().positive();

export type TGenerateNewInviteCode = z.infer<
  typeof generateNewInviteCodeSchema
>;
