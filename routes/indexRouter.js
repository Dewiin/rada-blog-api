import { Router } from "express";
import { indexController } from "../controllers/indexController.js";
export const indexRouter = Router();

// *add auth middleware*
indexRouter.get('/', indexController.getPosts);
indexRouter.post('/', indexController.createPost);
indexRouter.put('/:id', indexController.updatePost);

