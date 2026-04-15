import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor rodando com sucesso!');
});

export default app;