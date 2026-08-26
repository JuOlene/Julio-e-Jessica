import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Listar todos os convidados com status de confirmação
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, nome, COALESCE(confirmado, false) as confirmado FROM Convidados ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar convidados:', error);
    res.status(500).json({ error: 'Erro ao buscar lista de convidados.' });
  }
});

// Adicionar ou Confirmar presença de um convidado
router.post('/', async (req, res) => {
  const { nome, confirmado } = req.body;
  
  if (!nome || !nome.trim()) {
    return res.status(400).json({ error: 'O nome do convidado é obrigatório.' });
  }

  const isConfirmed = confirmado !== undefined ? Boolean(confirmado) : true;
  const trimmedName = nome.trim();

  try {
    // Verifica se já existe um convidado com esse nome (case-insensitive)
    const existing = await db.query(
      'SELECT id, nome, COALESCE(confirmado, false) as confirmado FROM Convidados WHERE LOWER(TRIM(nome)) = LOWER($1)',
      [trimmedName]
    );

    if (existing.rows.length > 0) {
      // Atualiza o status de confirmação
      const updated = await db.query(
        'UPDATE Convidados SET confirmado = $1 WHERE id = $2 RETURNING id, nome, confirmado',
        [isConfirmed, existing.rows[0].id]
      );
      return res.status(200).json({
        message: isConfirmed ? 'Presença confirmada com sucesso!' : 'Convidado atualizado.',
        convidado: updated.rows[0]
      });
    }

    // Insere novo convidado
    const result = await db.query(
      'INSERT INTO Convidados (nome, confirmado) VALUES ($1, $2) RETURNING id, nome, confirmado',
      [trimmedName, isConfirmed]
    );

    res.status(201).json({
      message: isConfirmed ? 'Presença confirmada com sucesso!' : 'Convidado adicionado à lista.',
      convidado: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao salvar convidado:', error);
    res.status(500).json({ error: 'Erro interno ao salvar convidado.' });
  }
});

// Alternar status de confirmação (Confirmado / Pendente)
router.patch('/:id/toggle', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'UPDATE Convidados SET confirmado = NOT COALESCE(confirmado, false) WHERE id = $1 RETURNING id, nome, confirmado',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Convidado não encontrado.' });
    }

    res.json({
      message: 'Status atualizado com sucesso!',
      convidado: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao alternar status do convidado:', error);
    res.status(500).json({ error: 'Erro ao alternar status do convidado.' });
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

export default router;
