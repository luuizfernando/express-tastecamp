import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = 4000;

app.get("/receitas", (req, res) => {
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
    ]

    res.send(receitas); 
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}.`));