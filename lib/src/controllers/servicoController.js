import { prisma } from '../../../lib/prisma.js';

export async function listar(req, res) {
  const { nome } = req.query;
  const servicos = await prisma.services.findMany({
    where: nome ? { nome: { contains: nome, mode: 'insensitive' } } : {},
    include: { professional: { include: { user: { select: { nome: true } } } } },
  });
  return res.json(servicos);
}

export async function buscarPorId(req, res) {
  const servico = await prisma.services.findUnique({
    where: { id: req.params.id },
    include: { professional: { include: { user: { select: { nome: true } } } } },
  });
  if (!servico) return res.status(404).json({ error: 'Serviço não encontrado' });
  return res.json(servico);
}

export async function criar(req, res) {
  const { nome, duracaominutos, preco, descricao, professionalId } = req.body;
  const servico = await prisma.services.create({
    data: { nome, duracaominutos, preco, descricao, professionalId },
  });
  return res.status(201).json(servico);
}

export async function atualizar(req, res) {
  const { nome, duracaominutos, preco, descricao } = req.body;
  const servico = await prisma.services.update({
    where: { id: req.params.id },
    data: { nome, duracaominutos, preco, descricao },
  });
  return res.json(servico);
}

export async function deletar(req, res) {
  await prisma.services.delete({ where: { id: req.params.id } });
  return res.status(204).send();
}