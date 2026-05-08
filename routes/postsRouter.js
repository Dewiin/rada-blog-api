import { Router } from "express";
import { postsController } from "../controllers/postsController.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
export const postsRouter = Router();

// *add auth middleware*
postsRouter.get('/', postsController.getAllPosts);
postsRouter.post('/', verifyAuth, postsController.createPost);
postsRouter.get('/:id', postsController.getPostById);
postsRouter.put('/:id', verifyAuth, postsController.updatePost);
postsRouter.delete('/:id', verifyAuth, postsController.deletePost);