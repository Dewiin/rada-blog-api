import { Router } from "express";
import { postsController } from "../controllers/postsController.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
export const postsRouter = Router();

// *add auth middleware*
postsRouter.get('/', postsController.getAllPublishedPosts);
postsRouter.get('/:id', postsController.getPost);
postsRouter.post('/', verifyAuth, postsController.createPost);
postsRouter.put('/:id', verifyAuth, postsController.updatePost);
postsRouter.get('/unpublished', verifyAuth, postsController.getAllUnpublishedPosts);

