const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



app.use('/api/routines', require('./routes/routines'));

app.use('/api/users', require('./routes/auth.routes'));
app.use('/api/profile', require('./routes/profile.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
