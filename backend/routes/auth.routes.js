const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Middleware simple para verificar el token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token requerido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.userId = user.id;
    next();
  });
}

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.userId;

  try {
    const [result] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [userId]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

module.exports = router;
