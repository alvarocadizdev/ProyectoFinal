const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // conexión MySQL
const jwt = require('jsonwebtoken');
require ('dotenv').config();

// Middleware para autenticar
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // extrae el token de "Bearer <token>"
  
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
  

// POST crear rutina
router.post('/', authenticateToken, async (req, res) => {
  const { day, time, activity } = req.body;
  try {
    await pool.query('INSERT INTO routines (user_id, day, time, activity) VALUES (?, ?, ?, ?)',
      [req.user.id, day, time, activity]);
    res.json({ message: 'Rutina creada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar la rutina' });
  }
});

// GET rutinas del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM routines WHERE user_id = ?', [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener rutinas' });
  }
});

module.exports = router;
