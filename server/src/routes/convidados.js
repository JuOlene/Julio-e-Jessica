const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Listar todos os convidados
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Convidados ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar convidados:', error);
    res.status(500).json({ error: 'Erro ao buscar lista de convidados.' });
  }
});

// Adicionar um convidado (Confirmação de presença)
router.post('/', async (req, res) => {
  const { nome } = req.body;
  
  if (!nome || !nome.trim()) {
    return res.status(400).json({ error: 'O nome do convidado é obrigatório.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO Convidados (nome) VALUES ($1) RETURNING *',
      [nome.trim()]
    );
    res.status(201).json({
      message: 'Presença confirmada com sucesso!',
      convidado: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
    res.status(500).json({ error: 'Erro interno ao salvar confirmação.' });
  }
});

// Excluir um convidado (Painel administrativo)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM Convidados WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Convidado não encontrado.' });
    }
    res.json({ message: 'Convidado removido com sucesso.', convidado: result.rows[0] });
  } catch (error) {
    console.error('Erro ao remover convidado:', error);
    res.status(500).json({ error: 'Erro ao remover convidado.' });
  }
});

module.exports = router;
