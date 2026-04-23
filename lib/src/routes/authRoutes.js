import { Router } from 'express';
import { validar } from '../middlewares/validate.js';
import { registerClienteSchema, registerFuncionarioSchema, loginSchema } from '../schemas/authSchema.js';
import { registerCliente, registerFuncionario, login } from '../controllers/authController.js';

const router = Router();

router.post('/register/cliente', validar(registerClienteSchema), registerCliente);
router.post('/register/funcionario', validar(registerFuncionarioSchema), registerFuncionario);
router.post('/login', validar(loginSchema), login);

export default router;