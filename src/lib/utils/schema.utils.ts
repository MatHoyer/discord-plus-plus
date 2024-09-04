import { z } from 'zod';

export const positiveNumber = z.number().positive();
