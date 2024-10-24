import { Router } from 'express';
import { signIn, signUp } from '../controllers/users.controller.js';
import { usuarioSchema } from '../schemas/users.schema.js';
import { validateSchema } from '../middlewares/validateSchema.middleware.js';

const usersRouter = Router();

usersRouter.post("/sign-up", validateSchema(usuarioSchema), signUp);
usersRouter.post("/sign-in", signIn);

export default usersRouter;