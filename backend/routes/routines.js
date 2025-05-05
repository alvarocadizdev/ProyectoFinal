const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);


  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


router.post('/', authenticateToken, async (req, res) => {
  const { day, time, activity } = req.body;
  try {
   
    await pool.query(
      'INSERT INTO routines (user_id, day, time, activity) VALUES (?, ?, ?, ?)',
      [req.user.id, day, time, activity]
    );
    res.json({ message: 'Rutina creada' });
  } catch (err) {
    console.error('Error al crear la rutina:', err);
    res.status(500).json({ error: 'Error al guardar la rutina' });
  }
});


router.get('/', authenticateToken, async (req, res) => {
  try {
   
    const [rows] = await pool.query('SELECT * FROM routines WHERE user_id = ?', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener las rutinas:', err);
    res.status(500).json({ error: 'Error al obtener rutinas' });
  }
});


router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
   
    const [result] = await pool.query('DELETE FROM routines WHERE id = ? AND user_id = ?', [id, req.user.id]);

    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Rutina no encontrada o no pertenece al usuario' });
    }

    
    res.json({ message: 'Rutina eliminada' });
  } catch (err) {
    console.error('Error al eliminar rutina:', err);
    res.status(500).json({ error: 'Error al eliminar rutina' });
  }
});

module.exports = router;
