import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
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
});

app.get("/receitas/:id", (req, res) => {
    // const { auth } = req.headers;
    // if (auth != "Luiz") return res.sendStatus(401);
    const { id } = req.params;

    db.collection("receitas").findOne({ _id: new ObjectId(id) })
        .then((receita) => res.send(receita))
        .catch((err => res.status(500).send(err.message)));
});

app.post("/receitas", (req, res) => {
    const { titulo, ingredientes, preparo } = req.body;

    if (!titulo || !ingredientes || !preparo) return res.status(422).send("Todos os campos são obrigatórios!");

    const novaReceita = { titulo, ingredientes, preparo };

    db.collection("receitas").insertOne(novaReceita)
        .then(() => res.sendStatus(201))
        .catch(err => res.status(500).send(err.message));
});

app.listen(process.env.PORT, () => console.log(`Servidor rodando na porta ${process.env.PORT}.`));