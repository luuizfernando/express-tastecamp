import { db } from '../database/database.connection.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { usuarioSchema } from '../schemas/users.schema.js'

export async function signUp(req, res) {
    const { nome, email, senha } = req.body;

    try {
        const usuario = await db.collection("usuarios").findOne({ email });
        if (usuario) return res.status(409).send("E-mail já cadastrado");

        const hash = bcrypt.hashSync(senha, 10);

        await db.collection("usuarios").insertOne({ nome, email, senha: hash });
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function signIn(req, res) {
    const { email, senha } = req.body;

    try {
        const usuario = await db.collection("usuarios").findOne({ email });
        if (!usuario) return res.status(401).send("E-mail não cadastrado");

        const correctPassword = bcrypt.compareSync(senha, usuario.senha);
        if (!correctPassword) return res.status(401).send("Senha incorreta");

        const token = uuid();
        await db.collection("sessoes").insertOne({ token, idUsuario: usuario._id });
        // res.send(token);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
};