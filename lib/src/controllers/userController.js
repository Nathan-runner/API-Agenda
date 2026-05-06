import { prisma } from '../../../lib/prisma.js';

export async function buscarUsuarioAutenticado(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.usuario.id },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      role: true,
      createdAt: true,
      professional: {
        select: {
          id: true,
          funcao: true,
          services: true,
          timeBlocks: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  return res.json(user);
}

export async function listarAgendamentosDoUsuario(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.usuario.id },
    select: {
      id: true,
      role: true,
      professional: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  if (user.role !== 'FUNCIONARIO' || !user.professional?.id) {
    return res.status(400).json({
      error: 'Não é possível listar agendamentos deste usuário com o schema atual.',
    });
  }

  const agendamentos = await prisma.appointment.findMany({
    where: {
      service: {
        professionalId: user.professional.id,
      },
    },
    include: {
      service: {
        include: {
          professional: {
            include: {
              user: {
                select: {
                  id: true,
                  nome: true,
                  email: true,
                  telefone: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      dataHoraInicio: 'asc',
    },
  });

  return res.json(agendamentos);
}
