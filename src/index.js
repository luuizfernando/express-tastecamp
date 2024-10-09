import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

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
    res.send(receitas);
});

app.get("/receitas/:id", (req, res) => {
    const { id } = req.params;
    const receita = receitas.find((item) => item.id === Number(id));
    res.send(receita);
});

app.post("/receitas", (req, res) => {
    const { titulo, ingredientes, preparo } = req.body;

    if (!titulo || !ingredientes || !preparo) return res.status(422).send("Todos os campos são obrigatórios!!");

    const novaReceita = { id: receitas.length + 1, titulo: titulo, ingredientes: ingredientes, preparo: preparo };
    receitas.push(novaReceita);
    res.sendStatus(201);
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}.`));