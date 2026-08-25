import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Login de administração para os noivos
router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'julioejessica2026';

  if (password === adminPassword) {
    return res.json({
      success: true,
      message: 'Autenticado com sucesso!',
      token: 'admin-session-token-' + Date.now()
    });
  } else {
    return res.status(401).json({ success: false, error: 'Senha incorreta.' });
  }
});

// Estatísticas para o painel dos noivos
router.get('/stats', async (req, res) => {
  try {
    const convidadosRes = await db.query('SELECT COUNT(*) FROM Convidados');
    const mensagensRes = await db.query('SELECT COUNT(*) FROM mensagens');

    res.json({
      totalConvidados: parseInt(convidadosRes.rows[0].count, 10),
      totalMensagens: parseInt(mensagensRes.rows[0].count, 10)
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do painel.' });
  }
});

export default router;
