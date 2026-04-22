import { Router } from 'express';
import { autenticar, apenasFunc } from '../middlewares/auth.js';
import { validar } from '../middlewares/validate.js';
import { servicoSchema } from '../schemas/servicoSchema.js';
import { listar, buscarPorId, criar, atualizar, deletar } from '../controllers/servicoController.js';

const router = Router();

router.get('/', listar);
router.get('/:id', buscarPorId);
router.post('/', autenticar, apenasFunc, validar(servicoSchema), criar);
router.put('/:id', autenticar, apenasFunc, validar(servicoSchema), atualizar);
router.delete('/:id', autenticar, apenasFunc, deletar);

export default router;