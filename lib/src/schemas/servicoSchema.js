import { z } from 'zod';

export const servicoSchema = z.object({
  nome: z.string().min(2),
  duracaominutos: z.number().int().positive(),
  preco: z.number().positive(),
  descricao: z.string().optional(),
  professionalId: z.string().uuid(),
});