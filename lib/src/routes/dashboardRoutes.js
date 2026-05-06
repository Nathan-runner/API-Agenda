import { Router } from 'express';
import { autenticar } from '../middlewares/auth.js';
import { 
  getMetricas, 
  getAgendamentosReceita, 
  getServicosPopulares, 
  getStatusAgendamentos, 
  getOcupacaoHorarios 
} from '../controllers/dashboardController.js';

const router = Router();

router.get('/metricas', autenticar, getMetricas);
router.get('/agendamentos-receita', autenticar, getAgendamentosReceita);
router.get('/servicos-populares', autenticar, getServicosPopulares);
router.get('/status-agendamentos', autenticar, getStatusAgendamentos);
router.get('/ocupacao-horarios', autenticar, getOcupacaoHorarios);

export default router;
