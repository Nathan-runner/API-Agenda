import { Router } from 'express';
import { autenticar } from '../middlewares/auth.js';
import { buscarUsuarioAutenticado, listarAgendamentosDoUsuario } from '../controllers/userController.js';

const router = Router();

router.get('/me', autenticar, buscarUsuarioAutenticado);
router.get('/me/agendamentos', autenticar, listarAgendamentosDoUsuario);

export default router;
