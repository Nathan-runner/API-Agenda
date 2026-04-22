import 'dotenv/config';
import express from 'express';
import authRoutes from './lib/src/routes/authRoutes.js';
import funcionarioRoutes from './lib/src/routes/funcionarioRoutes.js';
import servicoRoutes from './lib/src/routes/servicoRoutes.js';

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/funcionarios', funcionarioRoutes);
app.use('/servicos', servicoRoutes);

app.get('/', (req, res) => res.send('Servidor rodando!'));

export default app;