import { Router } from "express";
import recipesRouter from "./recipes.routes.js";
import usersRouter from "./users.routes.js";

const router = Router();
router.use(recipesRouter);
router.use(usersRouter);

export default router;