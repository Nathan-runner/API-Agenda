import { prisma } from '../../../lib/prisma.js';
import { addMinutes, startOfDay, endOfDay } from 'date-fns';

export async function buscarHorariosLivresLocal(profissionalId, dataIso, duracaoServicoMinutos) {
  const dataAlvo = new Date(dataIso);
  const diaDaSemana = dataAlvo.getDay();

  const jornada = await prisma.disponibilidadeProfissional.findUnique({
    where: { profissionalId_diaDaSemana: { profissionalId, diaDaSemana } }
  });

  if (!jornada) return [];

  const agendamentos = await prisma.agendamento.findMany({
    where: {
      profissionalId,
      dataHoraInicio: { gte: startOfDay(dataAlvo) },
      dataHoraFim: { lte: endOfDay(dataAlvo) },
      status: { not: 'CANCELADO' }
    },
    orderBy: { dataHoraInicio: 'asc' }
  });

  const horariosDisponiveis = [];
  const [inicioJornadaH, inicioJornadaM] = jornada.horaInicio.split(':').map(Number);
  const [fimJornadaH, fimJornadaM] = jornada.horaFim.split(':').map(Number);
  
  let ponteiroAtual = new Date(dataAlvo.setHours(inicioJornadaH, inicioJornadaM, 0, 0));
  const fimDoExpediente = new Date(dataAlvo.setHours(fimJornadaH, fimJornadaM, 0, 0));

  const intervaloDeBusca = 30;

  while (ponteiroAtual < fimDoExpediente) {
    const terminoPotencial = addMinutes(ponteiroAtual, duracaoServicoMinutos);

    if (terminoPotencial > fimDoExpediente) break;

    const temColisao = agendamentos.some(agendamento => {
      return (
        (ponteiroAtual >= agendamento.dataHoraInicio && ponteiroAtual < agendamento.dataHoraFim) ||
        (terminoPotencial > agendamento.dataHoraInicio && terminoPotencial <= agendamento.dataHoraFim) ||
        (ponteiroAtual <= agendamento.dataHoraInicio && terminoPotencial >= agendamento.dataHoraFim)
      );
    });

    if (!temColisao) {
      horariosDisponiveis.push({
        horarioFormatado: ponteiroAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        dataHoraIso: ponteiroAtual.toISOString(),
      });
    }

    ponteiroAtual = addMinutes(ponteiroAtual, intervaloDeBusca);
  }

  return horariosDisponiveis;
}