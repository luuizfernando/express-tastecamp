import cors from 'cors';
import express from 'express';
import router from './routes/index.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(process.env.PORT, () => console.log(`Servidor rodando na porta ${process.env.PORT}.`));