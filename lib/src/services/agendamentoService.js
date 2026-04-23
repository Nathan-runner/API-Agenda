import { prisma } from '../../../lib/prisma.js';
import { addMinutes } from 'date-fns';

export async function criarAgendamentoLocal({ profissionalId, servicoId, clienteId, dataHoraInicio }) {
  const inicioSolicitado = new Date(dataHoraInicio);

  const servico = await prisma.servico.findUnique({ where: { id: servicoId } });
  if (!servico) throw new Error('Serviço não encontrado.');

  const terminoPrevisto = addMinutes(inicioSolicitado, servico.duracaoEmMinutos);

  const agendamentoConflitante = await prisma.agendamento.findFirst({
    where: {
      profissionalId,
      status: { notIn: ['CANCELADO'] },
      AND: [
        { dataHoraInicio: { lt: terminoPrevisto } },
        { dataHoraFim: { gt: inicioSolicitado } }
      ]
    }
  });

  if (agendamentoConflitante) {
    throw new Error('Horário indisponível. Conflito com agendamento existente.');
  }

  const agendamento = await prisma.agendamento.create({
    data: {
      profissionalId,
      servicoId,
      clienteId,
      dataHoraInicio: inicioSolicitado,
      dataHoraFim: terminoPrevisto,
      status: 'PENDENTE'
    }
  });

  return agendamento;
}

export async function atualizarStatusAgendamentoLocal(agendamentoId, novoStatus) {
  const statusValidos = ['PENDENTE', 'CONFIRMADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'];
  
  if (!statusValidos.includes(novoStatus)) {
    throw new Error('Status de agendamento inválido.');
  }

  return await prisma.agendamento.update({
    where: { id: agendamentoId },
    data: { status: novoStatus }
  });
}