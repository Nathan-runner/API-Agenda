import { prisma } from '../../../lib/prisma.js';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, isWithinInterval } from 'date-fns';

export async function getMetricas(req, res) {
  try {
    const { dataInicio, dataFim, profissionalId } = req.query;
    const inicio = dataInicio ? new Date(dataInicio) : startOfWeek(new Date());
    const fim = dataFim ? new Date(dataFim) : endOfWeek(new Date());

    const whereClause = {
      dataHoraInicio: { gte: inicio, lte: fim },
      ...(profissionalId && { service: { professionalId } })
    };

    // 1. Agendamentos no período
    const totalAgendamentos = await prisma.appointment.count({ where: whereClause });

    // 2. Variação percentual (Semana atual vs Semana anterior)
    const inicioAnterior = subWeeks(inicio, 1);
    const fimAnterior = subWeeks(fim, 1);
    const totalAnterior = await prisma.appointment.count({
      where: {
        dataHoraInicio: { gte: inicioAnterior, lte: fimAnterior },
        ...(profissionalId && { service: { professionalId } })
      }
    });
    
    let variacao = 0;
    if (totalAnterior > 0) {
      variacao = Math.round(((totalAgendamentos - totalAnterior) / totalAnterior) * 100);
    }

    // 3. Taxa de Confirmação (Considerando FINALIZADO e EM_ATENDIMENTO como confirmados/realizados)
    const confirmados = await prisma.appointment.count({
      where: {
        ...whereClause,
        status: { in: ['FINALIZADO', 'EM_ATENDIMENTO'] }
      }
    });
    const taxaConfirmacao = totalAgendamentos > 0 ? Math.round((confirmados / totalAgendamentos) * 100) : 0;

    // 4. Receita Prevista (Soma de todos os agendamentos não cancelados)
    const agendamentosReceita = await prisma.appointment.findMany({
      where: {
        ...whereClause,
        status: { not: 'CANCELADO' }
      },
      include: { service: true }
    });
    const receitaPrevista = agendamentosReceita.reduce((acc, curr) => acc + (curr.service.preco || 0), 0);

    // 5. Serviço Líder
    const servicosAgrupados = agendamentosReceita.reduce((acc, curr) => {
      acc[curr.service.nome] = (acc[curr.service.nome] || 0) + 1;
      return acc;
    }, {});
    
    let servicoLider = { nome: "N/A", quantidade: 0 };
    Object.entries(servicosAgrupados).forEach(([nome, quantidade]) => {
      if (quantidade > servicoLider.quantidade) {
        servicoLider = { nome, quantidade };
      }
    });

    return res.json({
      agendamentosSemana: { valor: totalAgendamentos, variacaoPercentual: variacao },
      taxaConfirmacao: { valor: taxaConfirmacao, descricao: "Percentual de agendamentos finalizados/em atendimento" },
      receitaPrevista: { valor: receitaPrevista, moeda: "BRL" },
      servicoLider
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getAgendamentosReceita(req, res) {
  try {
    const { dataInicio, dataFim, profissionalId } = req.query;
    if (!dataInicio || !dataFim) return res.status(400).json({ error: "dataInicio e dataFim são obrigatórios" });

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    const agendamentos = await prisma.appointment.findMany({
      where: {
        dataHoraInicio: { gte: inicio, lte: fim },
        status: { not: 'CANCELADO' },
        ...(profissionalId && { service: { professionalId } })
      },
      include: { service: true }
    });

    const mapa = {};
    let dataAtual = new Date(inicio);
    while (dataAtual <= fim) {
      const chave = dataAtual.toISOString().split('T')[0];
      mapa[chave] = { data: chave, agendamentos: 0, receita: 0 };
      dataAtual.setDate(dataAtual.getDate() + 1);
    }

    agendamentos.forEach(ag => {
      const dataStr = ag.dataHoraInicio.toISOString().split('T')[0];
      if (mapa[dataStr]) {
        mapa[dataStr].agendamentos += 1;
        mapa[dataStr].receita += ag.service.preco || 0;
      }
    });

    return res.json({
      periodo: { dataInicio, dataFim },
      itens: Object.values(mapa)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getServicosPopulares(req, res) {
  try {
    const { dataInicio, dataFim, profissionalId } = req.query;
    const inicio = dataInicio ? new Date(dataInicio) : startOfMonth(new Date());
    const fim = dataFim ? new Date(dataFim) : endOfMonth(new Date());

    const agendamentos = await prisma.appointment.findMany({
      where: {
        dataHoraInicio: { gte: inicio, lte: fim },
        ...(profissionalId && { service: { professionalId } })
      },
      include: { service: true }
    });

    const agrupado = agendamentos.reduce((acc, curr) => {
      const categoria = curr.service.nome; // Usando nome como categoria pois não existe campo categoria
      acc[categoria] = (acc[categoria] || 0) + 1;
      return acc;
    }, {});

    const itens = Object.entries(agrupado).map(([categoria, quantidade]) => ({ categoria, quantidade }));

    return res.json({ itens });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getStatusAgendamentos(req, res) {
  try {
    const { dataInicio, dataFim, profissionalId } = req.query;
    const inicio = dataInicio ? new Date(dataInicio) : startOfDay(new Date());
    const fim = dataFim ? new Date(dataFim) : endOfDay(new Date());

    const statusCounts = await prisma.appointment.groupBy({
      by: ['status'],
      where: {
        dataHoraInicio: { gte: inicio, lte: fim },
        ...(profissionalId && { service: { professionalId } })
      },
      _count: { id: true }
    });

    const itens = statusCounts.map(s => ({
      status: s.status,
      quantidade: s._count.id
    }));

    return res.json({ itens });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getOcupacaoHorarios(req, res) {
  try {
    const { dataInicio, dataFim, profissionalId } = req.query;
    const inicio = dataInicio ? new Date(dataInicio) : startOfDay(new Date());
    const fim = dataFim ? new Date(dataFim) : endOfDay(new Date());

    const agendamentos = await prisma.appointment.findMany({
      where: {
        dataHoraInicio: { gte: inicio, lte: fim },
        status: { not: 'CANCELADO' },
        ...(profissionalId && { service: { professionalId } })
      }
    });

    const faixas = {};
    // Inicializa faixas das 08:00 às 20:00
    for (let h = 8; h <= 20; h++) {
      const horaStr = `${h.toString().padStart(2, '0')}:00`;
      faixas[horaStr] = 0;
    }

    agendamentos.forEach(ag => {
      const hora = ag.dataHoraInicio.getHours();
      const horaStr = `${hora.toString().padStart(2, '0')}:00`;
      if (faixas[horaStr] !== undefined) {
        faixas[horaStr] += 1;
      }
    });

    // Cálculo simples de ocupação: 1 agendamento por hora = 100% (ajustar se necessário)
    const itens = Object.entries(faixas).map(([hora, total]) => ({
      hora,
      ocupacaoPercentual: Math.min(total * 25, 100) // Exemplo: 4 agendamentos na mesma hora = 100%
    }));

    return res.json({ itens });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
