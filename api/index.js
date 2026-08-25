import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import convidadosRoutes from './routes/convidados.js';
import mensagensRoutes from './routes/mensagens.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rotas da API
app.use('/api/convidados', convidadosRoutes);
app.use('/api/mensagens', mensagensRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Casamento Julio & Jessica online!' });
});

export default app;
