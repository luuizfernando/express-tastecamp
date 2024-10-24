import { Router } from 'express';
import { createReceita, deleteReceita, editMuitasReceitas, editReceita, getReceita, getReceitaById } from '../controllers/recipes.controller.js';
import { validateSchema } from '../middlewares/validateSchema.middleware.js';
import { receitaSchema } from '../schemas/recipes.schema.js';
import { authValidation } from '../middlewares/auth.middleware.js';

const recipesRouter = Router();

recipesRouter.use(authValidation);
recipesRouter.get("/receitas", getReceita);
recipesRouter.get("/receitas/:id", getReceitaById);
recipesRouter.post("/receitas", validateSchema(receitaSchema), createReceita);
recipesRouter.delete("/receitas/:id", deleteReceita);
recipesRouter.put("/receitas/:id", validateSchema(receitaSchema), editReceita);
recipesRouter.put("/receitas/muitas/:filtroIngredientes", validateSchema(receitaSchema), editMuitasReceitas);

export default recipesRouter;