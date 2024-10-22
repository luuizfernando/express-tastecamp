import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import joi from 'joi';
import { MongoClient } from 'mongodb';
import { createReceita, deleteReceita, editMuitasReceitas, editReceita, getReceita, getReceitaById } from './controllers/recipesController.js';
import { signIn, signUp } from './controllers/userController.js';

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
try {
    await mongoClient.connect();
    console.log("MongoDB conectado!");
} catch (err) {
    console.log(err.message);
}
export const db = mongoClient.db();

export const usuarioSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().required().min(3)
});

app.get("/receitas", getReceita);

app.get("/receitas/:id", getReceitaById);

app.post("/receitas", createReceita);

app.delete("/receitas/:id", deleteReceita);

app.put("/receitas/:id", editReceita);

app.put("/receitas/muitas/:filtroIngredientes", editMuitasReceitas);

app.post("/sign-up", signUp);

app.post("/sign-in", signIn);

app.listen(process.env.PORT, () => console.log(`Servidor rodando na porta ${process.env.PORT}.`));