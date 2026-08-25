const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Listar todas as mensagens
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM mensagens ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens do mural.' });
  }
});

// Enviar uma nova mensagem com foto opcional
router.post('/', async (req, res) => {
  const { nome, mensagens, foto } = req.body;

  if (!nome || !nome.trim()) {
    return res.status(400).json({ error: 'O nome é obrigatório.' });
  }

  if (!mensagens || !mensagens.trim()) {
    return res.status(400).json({ error: 'A mensagem é obrigatória.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO mensagens (nome, mensagens, foto) VALUES ($1, $2, $3) RETURNING *',
      [nome.trim(), mensagens.trim(), foto || null]
    );
    res.status(201).json({
      message: 'Mensagem enviada com sucesso!',
      mensagem: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    res.status(500).json({ error: 'Erro interno ao salvar mensagem.' });
  }
});

// Excluir mensagem (Painel administrativo)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM mensagens WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Mensagem não encontrada.' });
    }
    res.json({ message: 'Mensagem removida com sucesso.', mensagem: result.rows[0] });
  } catch (error) {
    console.error('Erro ao remover mensagem:', error);
    res.status(500).json({ error: 'Erro ao remover mensagem.' });
  }
});

module.exports = router;
