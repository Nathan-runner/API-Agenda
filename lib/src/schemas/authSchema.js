import { z } from 'zod';

export const registerClienteSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  telefone: z.string().min(8),
});

export const registerFuncionarioSchema = registerClienteSchema.extend({
  funcao: z.string().min(2),
  codigoEmpresa: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});