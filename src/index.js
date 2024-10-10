import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

let db;
const mongoClient = new MongoClient(process.env.DATABASE_URL);
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message));

const PORT = 4000;

const receitas = [
    {
        id: 1,
        titulo: "Pão com Ovo",
        ingredientes: "Pão e Ovo",
        preparo: "Frite o ovo e coloque no pão",
    },
    {
        id: 2,
        titulo: "Mingau de Whey",
        ingredientes: "Leite, Aveia e Whey",
        preparo: "Misture tudo na panela fervendo",
    }
];



app.get("/receitas", (req, res) => {
    // const { ingredientes } = req.query;

    // if (ingredientes) {
    //     const receitasFiltradas = receitas.filter(
    //         receita => receita.ingredientes.toLowerCase().includes(ingredientes.toLowerCase())
    //     );

    //     return res.send(receitasFiltradas);
    // }

    db.collection("receitas").find().toArray()
        .then(receitas => res.send(receitas))
        .catch(err => res.status(500).send(err.message));

    res.send(receitas);
});

app.get("/receitas/:id", (req, res) => {
    const { id } = req.params;
    const { auth } = req.headers;

    if (auth != "Luiz") return res.sendStatus(401); // Exemplo de header

    const receita = receitas.find((item) => item.id === Number(id));
    res.send(receita);
});

app.post("/receitas", (req, res) => {
    const { titulo, ingredientes, preparo } = req.body;

    if (!titulo || !ingredientes || !preparo) return res.status(422).send("Todos os campos são obrigatórios!!");

    const novaReceita = { titulo: titulo, ingredientes: ingredientes, preparo: preparo };
    
    db.collection("receitas").insertOne(novaReceita)
        .then(() => res.sendStatus(201))
        .catch(err => res.status(500).send(err.message));
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}.`));