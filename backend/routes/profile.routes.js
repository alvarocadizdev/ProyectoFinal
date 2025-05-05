const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');


function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido' });

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      next();
  } catch (err) {
      return res.status(401).json({ message: 'Token inválido' });
  }
}

router.post('/', auth, async (req, res) => {
  const { interests, goals } = req.body;
  try {
      const [existing] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [req.userId]);
      if (existing.length > 0) {
          await db.query('UPDATE profiles SET interests = ?, goals = ? WHERE user_id = ?', [interests, goals, req.userId]);
      } else {
          await db.query('INSERT INTO profiles (user_id, interests, goals) VALUES (?, ?, ?)', [req.userId, interests, goals]);
      }
      res.json({ message: 'Perfil guardado' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


router.get('/', auth, async (req, res) => {
  try {
      const [profile] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [req.userId]);
      res.json(profile[0] || {});
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

module.exports = router;
