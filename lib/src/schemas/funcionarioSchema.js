import { z } from 'zod';

export const funcionarioSchema = z.object({
  funcao: z.string().min(2),
});