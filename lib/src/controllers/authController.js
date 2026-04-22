import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma.js';

export async function registerCliente(req, res) {
  const { nome, email, password, telefone } = req.body;
  const existe = await prisma.user.findUnique({ where: { email } });
  if (existe) return res.status(409).json({ error: 'Email já cadastrado' });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { nome, email, password: hash, telefone, role: 'CLIENTE' },
  });
  return res.status(201).json({ id: user.id, nome: user.nome, role: user.role });
}

export async function registerFuncionario(req, res) {
  const { nome, email, password, telefone, funcao, codigoEmpresa } = req.body;

  if (codigoEmpresa !== process.env.COMPANY_CODE) {
    return res.status(403).json({ error: 'Código da empresa inválido' });
  }

  const existe = await prisma.user.findUnique({ where: { email } });
  if (existe) return res.status(409).json({ error: 'Email já cadastrado' });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      nome, email, password: hash, telefone, role: 'FUNCIONARIO',
      professional: { create: { funcao } },
    },
    include: { professional: true },
  });
  return res.status(201).json({ id: user.id, nome: user.nome, role: user.role, funcao });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email }, include: { professional: true } });
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

  const senhaCorreta = await bcrypt.compare(password, user.password);
  if (!senhaCorreta) return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign(
    { id: user.id, role: user.role, professionalId: user.professional?.id },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  return res.json({ token, role: user.role, nome: user.nome });
}