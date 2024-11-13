const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
require('dotenv').config(); // Mantenha isso no topo do seu app.js


const port = process.env.PORT || 3000;

/* ---------- Configurações do Express ---------- */

const app = express();

app.use(express.json());
app.use('/users', userRouter); // Importa as rotas que criamos no arquivo src/routes/user.js e as adiciona depois de /users/


/* ---------- Criar conexão com o banco ---------- */

  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => {
        console.error('Could not connect to MongoDB Atlas', err);
        process.exit(1); // Encerra o processo caso a conexão falhe
    });


/* ---------- Sobe nosso servidor de aplicação ---------- */

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});