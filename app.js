import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './lib/src/routes/authRoutes.js';
import funcionarioRoutes from './lib/src/routes/funcionarioRoutes.js';
import servicoRoutes from './lib/src/routes/servicoRoutes.js';
import agendamentoRoutes from './lib/src/routes/agendamentoRoutes.js';
import dashboardRoutes from './lib/src/routes/dashboardRoutes.js';
import userRoutes from './lib/src/routes/userRoutes.js';

const app = express(); 
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/funcionarios', funcionarioRoutes);
app.use('/servicos', servicoRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => res.send('Servidor rodando!'));

export default app;