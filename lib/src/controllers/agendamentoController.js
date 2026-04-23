import { criarAgendamentoLocal, atualizarStatusAgendamentoLocal } from '../services/agendamentoService.js';
import { buscarHorariosLivresLocal } from '../services/disponibilidadeService.js';

export async function criarAgendamento(req, res) {
  try {
    const { profissionalId, servicoId, clienteId, dataHoraInicio } = req.body;
    const agendamento = await criarAgendamentoLocal({ profissionalId, servicoId, clienteId, dataHoraInicio });
    return res.status(201).json(agendamento);
  } catch (error) {
    if (error.message.includes('Conflito')) {
      return res.status(409).json({ error: error.message });
    }
    return res.status(400).json({ error: error.message });
  }
}

export async function atualizarStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const agendamentoAtualizado = await atualizarStatusAgendamentoLocal(id, status);
    return res.status(200).json(agendamentoAtualizado);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function listarHorariosLivres(req, res) {
  try {
    const { profissionalId, dataIso, duracaoServicoMinutos } = req.query;
    const horarios = await buscarHorariosLivresLocal(profissionalId, dataIso, parseInt(duracaoServicoMinutos));
    return res.status(200).json(horarios);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}