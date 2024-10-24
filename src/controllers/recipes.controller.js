import { db } from '../database/database.connection.js';
import { ObjectId } from 'mongodb';
import { receitaSchema } from '../schemas/recipes.schema.js';

export async function getReceita(req, res) {
    try {
        const receitas = await db.collection("receitas").find().toArray();
        res.send(receitas);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function getReceitaById(req, res) {
    const { id } = req.params;
    try {
        const receita = await db.collection("receitas").findOne({ _id: new ObjectId(id) })
        if (!receita) return res.status(404).send("Receita não existe");
        res.send(receita);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function createReceita(req, res) {
    const { authorization } = req.headers;
    const { titulo } = req.body;

    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);

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
};

export async function deleteReceita(req, res) {
    const { id } = req.params;

    try {
        const result = await db.collection("receitas").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).status("Esse item não existe");
        res.send("Item deletado com sucesso!");
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function editReceita(req, res) {
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
        if (!receita.idUsuario.equals(sessao.idUsuario)) return res.sendStatus(401);

        await db.collection("receitas").updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        res.send("Receita atualizada");
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function editMuitasReceitas(req, res) {
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
};