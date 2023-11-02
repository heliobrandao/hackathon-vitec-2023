const express = require('express');
const simulationRoutes = require('./routes/simulationRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/api', simulationRoutes);

app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});
