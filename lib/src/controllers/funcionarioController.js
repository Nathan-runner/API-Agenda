import { prisma } from '../../../lib/prisma.js';

export async function listar(req, res) {
  const { nome, funcao } = req.query;
  const funcionarios = await prisma.professional.findMany({
    where: {
      ...(funcao && { funcao: { contains: funcao, mode: 'insensitive' } }),
      ...(nome && { user: { nome: { contains: nome, mode: 'insensitive' } } }),
    },
    include: { user: { select: { id: true, nome: true, email: true, telefone: true } }, services: true },
  });
  return res.json(funcionarios);
}

export async function buscarPorId(req, res) {
  const func = await prisma.professional.findUnique({
    where: { id: req.params.id },
    include: { user: { select: { id: true, nome: true, email: true, telefone: true } }, services: true },
  });
  if (!func) return res.status(404).json({ error: 'Funcionário não encontrado' });
  return res.json(func);
}

export async function atualizar(req, res) {
  const { funcao } = req.body;
  const func = await prisma.professional.update({
    where: { id: req.params.id },
    data: { funcao },
  });
  return res.json(func);
}

export async function deletar(req, res) {
  await prisma.professional.delete({ where: { id: req.params.id } });
  return res.status(204).send();
}