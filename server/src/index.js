const express = require('express');
const cors = require('cors');
require('dotenv').config();

const convidadosRoutes = require('./routes/convidados');
const mensagensRoutes = require('./routes/mensagens');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
  console.log(` Endpoints disponíveis em http://localhost:${PORT}/api/`);
});
