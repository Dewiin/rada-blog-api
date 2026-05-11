import { Router } from "express";
import { postsController } from "../controllers/postsController.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { verifyToken } from "../middleware/verifyToken.js"
export const postsRouter = Router();

postsRouter.get('/', postsController.getAllPosts);
postsRouter.post('/', verifyAuth, postsController.createPost);
postsRouter.get('/:id', postsController.getPostById);
postsRouter.put('/:id', verifyAuth, postsController.updatePost);
postsRouter.delete('/:id', verifyAuth, postsController.deletePost);
postsRouter.post('/:id/clap', verifyToken, postsController.addClap);