import { Router } from 'express';
import { createReceita, deleteReceita, editMuitasReceitas, editReceita, getReceita, getReceitaById } from '../controllers/recipes.controller.js';

const recipesRouter = Router();

recipesRouter.get("/receitas", getReceita);
recipesRouter.get("/receitas/:id", getReceitaById);
recipesRouter.post("/receitas", createReceita);
recipesRouter.delete("/receitas/:id", deleteReceita);
recipesRouter.put("/receitas/:id", editReceita);
recipesRouter.put("/receitas/muitas/:filtroIngredientes", editMuitasReceitas);

export default recipesRouter;