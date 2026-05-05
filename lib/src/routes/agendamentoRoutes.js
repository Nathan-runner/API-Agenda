import { Router } from 'express';
import { criarAgendamento, atualizarStatus, listarHorariosLivres } from '../controllers/agendamentoController.js';
import { autenticar } from '../middlewares/auth.js'; // Supondo que o middleware de auth exista com este nome

const router = Router();

// Rota para o front-end consultar horários disponíveis antes de agendar
router.get('/disponibilidade', listarHorariosLivres);

// Rotas de criação e manipulação (Protegidas por autenticação)
router.post('/', autenticar, criarAgendamento);
router.patch('/:id/status', autenticar, atualizarStatus);

export default router;