import { Router } from 'express';
import { signIn, signUp } from '../controllers/users.controller.js';

const usersRouter = Router();

usersRouter.post("/sign-up", signUp);
usersRouter.post("/sign-in", signIn);

export default usersRouter;