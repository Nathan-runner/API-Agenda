import { Router } from 'express';
import { autenticar, apenasFunc } from '../middlewares/auth.js';
import { validar } from '../middlewares/validate.js';
import { funcionarioSchema } from '../schemas/funcionarioSchema.js';
import { listar, buscarPorId, atualizar, deletar } from '../controllers/funcionarioController.js';

const router = Router();

router.get('/', autenticar, listar);
router.get('/:id', autenticar, buscarPorId);
router.put('/:id', autenticar, apenasFunc, validar(funcionarioSchema), atualizar);
router.delete('/:id', autenticar, apenasFunc, deletar);

export default router;