import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import joi from 'joi';
import { MongoClient, ObjectId } from 'mongodb';
import { v4 as uuid } from 'uuid';

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
const db = mongoClient.db();

const usuarioSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().required().min(3)
});

app.get("/receitas", async (req, res) => {
    try {
        const receitas = await db.collection("receitas").find().toArray();
        res.send(receitas);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/receitas/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const receita = await db.collection("receitas").findOne({ _id: new ObjectId(id) })
        if (!receita) return res.status(404).send("Receita não existe");
        res.send(receita);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/receitas", async (req, res) => {
    const { authorization } = req.headers;
    const { titulo } = req.body;

    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);

    const receitaSchema = joi.object({
        titulo: joi.string().required(),
        ingredientes: joi.string().required(),
        preparo: joi.string().required()
    });

    const validation = receitaSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const sessao = await db.collection("sessoes").findOne({ token });
        if (!sessao) return res.sendStatus(401);

        const recipe = await db.collection("receitas").findOne({ titulo: titulo });
        if (recipe) return res.status(409).send("Essa receita já existe.");

        await db.collection("receitas").insertOne({ ...req.body, idUsuario: sessao.idUsuario });
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete("/receitas/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.collection("receitas").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).status("Esse item não existe");
        res.send("Item deletado com sucesso!");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put("/receitas/:id", async (req, res) => {
    const { id } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);

    const receitaSchema = joi.object({
        titulo: joi.string(),
        ingredientes: joi.string(),
        preparo: joi.string()
    });

    const validation = receitaSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const sessao = await db.collection("sessoes").findOne({ token });
        if (!sessao) return res.sendStatus(401);

        const receita = await db.collection("receitas").findOne({ _id: new ObjectId(id) });
        if (!receita) return res.sendStatus(404);
        if (receita.idUsuario !== sessao.idUsuario) return res.sendStatus(401);

        await db.collection("receitas").updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        res.send("Receita atualizada");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put("/receitas/muitas/:filtroIngredientes", async (req, res) => {
    const { filtroIngredientes } = req.params;
    const { titulo, preparo, ingredientes } = req.body;

    const receitasEditadas = {};
    if (titulo) receitasEditadas.titulo = titulo;
    if (preparo) receitasEditadas.preparo = preparo;
    if (ingredientes) receitasEditadas.ingredientes = ingredientes;

    try {
        const result = await db.collection("receitas").updateMany(
            { ingredientes: { $regex: filtroIngredientes, $options: "i" } },
            { $set: receitasEditadas }
        );

        if (result.matchedCount === 0) return res.status(404).send("Não existe nenhuma receita com esse filtro.");
        res.send("receitasEditadas");

    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/sign-up", async (req, res) => {
    const { nome, email, senha } = req.body;

    const validation = usuarioSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const usuario = await db.collection("usuarios").findOne({ email });
        if (usuario) return res.status(409).send("E-mail já cadastrado");

        const hash = bcrypt.hashSync(senha, 10);

        await db.collection("usuarios").insertOne({ nome, email, senha: hash });
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/sign-in", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await db.collection("usuarios").findOne({ email });
        if (!usuario) return res.status(401).send("E-mail não cadastrado");

        const correctPassword = bcrypt.compareSync(senha, usuario.senha);
        if (!correctPassword) return res.status(401).send("Senha incorreta");

        const token = uuid();
        await db.collection("sessoes").insertOne({ token, idUsuario: usuario._id });
        // req.send(token);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(process.env.PORT, () => console.log(`Servidor rodando na porta ${process.env.PORT}.`));