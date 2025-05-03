const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.get('/profile', verifyToken, async (req, res) => {
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
